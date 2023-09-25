import {
  Component,
  ViewChild
} from '@angular/core';
import {
  ColorScheme,
  QueryService,
  ChipTransformPipe,
  CatalogueService,
  Condition,
  ConditionTypes,
  Criteria,
  Operation
} from '@samply/lens-core';
import {AutoComplete} from "primeng/autocomplete";

@Component({
  selector: 'lens-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  colors: ColorScheme = new ColorScheme();

  queryHelpString: string = "";
  chips: Array<Condition | Operation> = [];

  currentSearchTerm?: any

  suggestions: Array<{ label: string, value: string, items: Array<Condition | Operation> }> = [];

  searchBarInput: any;

  @ViewChild(AutoComplete) searchBar!: AutoComplete

  constructor(
    public queryService: QueryService,
    public catalogueService: CatalogueService,
    private chipTransform: ChipTransformPipe,
  ) {
    // Update query info string based on changes
    queryService.query$.subscribe(value => {
      if (!queryService.isEmpty()) {
        this.queryHelpString = value.ast.toString()
      }
    })
    // Update chips based on changes to the query
    queryService.query$.subscribe(value => {
      this.chips = value.ast.children
    })
  }


  public search(event: { originalEvent: Event, query: string }) {

    this.searchBarInput = event.originalEvent.target
    if (event.query.length < 3) {
      this.currentSearchTerm = undefined;
      this.suggestions = [{ label: "", value: "Search will start with 3 inserted letters ...", items: [] }];
    } else {
      this.currentSearchTerm = event.query;
      let criterias: Array<Criteria> = this.catalogueService.getCriterias()

      this.suggestions = criterias.filter(criteria => {
        let queryInUppercase = event.query.toUpperCase();
        return criteria.key.toUpperCase().indexOf(queryInUppercase) != -1 ||
          criteria.displayName.de.toUpperCase().indexOf(queryInUppercase) != -1 ||
          (criteria.values != undefined && criteria.values.find(item => {
            return item.key.toUpperCase().indexOf(queryInUppercase) != -1
              || item.de.toUpperCase().indexOf(queryInUppercase) != -1
              || item.en.toUpperCase().indexOf(queryInUppercase) != -1
          }));
      }).slice(0, 20).flatMap(criteria => {
        let criteriaSuggestions: Array<Condition | Operation> = []
        if (criteria.values != undefined) {
          criteria.values.forEach(value => {
            if (value instanceof Operation) {
              criteriaSuggestions.push(new Operation(
                "OR",
                [value],
                criteria.key,
                criteria.displayName.de,
                criteria.displayName.en
              ))
            } else {
              let queryInUppercase = event.query.toUpperCase()
              if (value.key.toUpperCase().indexOf(queryInUppercase) != -1
                || value.de.toUpperCase().indexOf(queryInUppercase) != -1
                || value.en.toUpperCase().indexOf(queryInUppercase) != -1
              ) {

                // not clear why only 'IN' is needed to be checked here
                // should not work for other cases as well like this, but it does
                // for example 'CONTAINS' is not checked here, but it works somehow
                let conditionType: ConditionTypes = 'EQUALS'
                if (criteria.allowedConditionTypes.includes('IN')) conditionType = 'IN'

                criteriaSuggestions.push(
                  new Condition(
                    criteria.key,
                    conditionType,
                    criteria.system,
                    value.key,
                    value.de
                  ))
              }
            }
          })
          criteriaSuggestions = this.addPercentageSignAsGroupingSymbol(criteriaSuggestions, event.query)
        }
        return { label: criteria.displayName.de, value: criteria.key, items: criteriaSuggestions }
      })
    }
  }


  addPercentageSignAsGroupingSymbol(cirteriaSuggestions: any, query: any): Array<Condition | Operation> {
    const regexForICD10SuperGroupWithSubgroups = /[a-zA-Z][0-9][0-9]/g;

    if (
      !query.match(regexForICD10SuperGroupWithSubgroups) ||
      cirteriaSuggestions.length <= 1 ||
      cirteriaSuggestions[0].value === undefined
    ) {
      return cirteriaSuggestions
    }

    const baseCode = cirteriaSuggestions[0].value.split(".")[0]

    const wildcard: Condition = new Condition(
      "diagnosis",
      "CONTAINS",
      "http://fhir.de/CodeSystem/dimdi/icd-10-gm",
      baseCode + ".%",
      "Get all subcodes for " + baseCode,
    )

    return [wildcard, ...cirteriaSuggestions]
  }


  onSearchClick() {
    this.queryService.send()
  }

  onClearClick() {
    this.queryService.clear();
    this.searchBar.inputValue = ''
    this.currentSearchTerm = ''
    this.searchBarInput.value = ''
  }

  removeCondition(condition: Condition) {
    this.queryService.delete(condition)
  }

  isCondition(item: any): boolean {
    return item instanceof Condition;
  }

  isOperation(item: any): boolean {
    return item instanceof Operation;
  }


  suggestionSelected($event: Condition) {
    // if an operation or condition with the key exists, add the new value to its children with an OR, otherwise create a new condition

    const existingValue = this.queryService.read($event.key);

    if (!existingValue) {
      if ($event.type === 'IN')
        $event.value = [`${$event.value}`]
      this.queryService.create($event)
      return
    }

    if ((existingValue instanceof Condition)) {

      if (existingValue.type === 'IN' && (Array.isArray(existingValue.value) || typeof existingValue.value === 'string')) {
        // add to the 'IN' String Array
        const newValue: string[] = Array.isArray(existingValue.value)
          ? [...existingValue.value, `${$event.value}`]
          : [existingValue.value, `${$event.value}`]

        $event = new Condition(
          $event.key,
          $event.type,
          $event.system,
          newValue,
          $event.de
        );

        this.queryService.update($event)

      } else {
        // make new operation with existing value and new value
        const newOperation: Operation = new Operation(
          "OR",
          [existingValue, $event],
          $event.key,
        )
        this.queryService.update(newOperation)
      }
      return
    }
    // add to existing operation
    const updatedOperation = new Operation(
      existingValue.operand,
      [...existingValue.children, $event],
      existingValue.key,
    )
    this.queryService.update(updatedOperation)
  }

  /** HACK: This will be executed really often, for example on mouse movement.
   * Currently no performance issues noticeable. */
  public executeChipTransform(value: Condition | Operation): string {
    return this.chipTransform.transform(value);
  }

  public onMouseEnter(element: HTMLElement): void {
    element.style.opacity = "0.8";
  }
  public onMouseLeave(element: HTMLElement): void {
    element.style.opacity = "1";
  }

}
