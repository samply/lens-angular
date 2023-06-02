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

  suggestions: Array<{label: string, value: string, items: Array<Condition | Operation>}>= [];

  @ViewChild(AutoComplete) searchBar!: AutoComplete

  constructor(
    public queryService: QueryService,
    public catalogueService: CatalogueService,
    private chipTransform: ChipTransformPipe
  ) {
    // Update query info string based on changes
    queryService.query$.subscribe(value => {
      if(!queryService.isEmpty()) {
        this.queryHelpString = value.ast.toString()
      }
    })
    // Update chips based on changes to the query
    queryService.query$.subscribe(value => {
      this.chips = value.ast.children
    })
  }


  public search(event: { originalEvent: Event, query: string }) {
    if (event.query.length < 3){
      this.currentSearchTerm = undefined;
      this.suggestions = [{label: "", value: "Search will start with 3 inserted letters ...", items: []}];
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
      }).slice(0,20).flatMap(criteria => {
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
                || value.en.toUpperCase().indexOf(queryInUppercase) != -1) {
                criteriaSuggestions.push(
                  new Condition(
                    criteria.key,
                    criteria.key === "gender" ? "IN" : "EQUALS",
                    criteria.system,
                    value.key,
                    value.de
                  ))
              }
            }
          })
        }
        return {label: criteria.displayName.de, value: criteria.key, items: criteriaSuggestions}
      })
    }
  }

  onSearchClick() {
    this.queryService.send()
  }

  onClearClick() {
    this.queryService.clear();
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

  suggestionSelected($event: Condition | Operation) {
    let existingValue = this.queryService.read($event.key);
    console.log(existingValue)
    if (existingValue) {
      this.queryService.update($event)
    } else {
      this.queryService.create($event)
    }
  }

  /** HACK: This will be executed really often, for example on mouse movement.
   * Currently no performance issues noticeable. */
  public executeChipTransform(value: Condition | Operation): string {
    return this.chipTransform.transform(value);
  }

  public onMouseEnter(element: HTMLElement) : void {
    element.style.opacity = "0.8";
  }
  public onMouseLeave(element: HTMLElement) : void {
    element.style.opacity = "1";
  }

}
