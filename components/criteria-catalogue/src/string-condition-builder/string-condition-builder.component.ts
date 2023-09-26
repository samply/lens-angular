import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  QueryService,
  CatalogueService,
  Criteria,
  Condition,
  Operation
} from '@samply/lens-core';

@Component({
  selector: 'lens-string-condition-builder',
  templateUrl: './string-condition-builder.component.html',
  styleUrls: ['./string-condition-builder.component.css']
})
export class StringConditionBuilderComponent implements OnInit {

  @Input() key!: string;

  criteria!: Criteria;
  currentCondition!: Condition | Operation;

  suggestions: string[] = []
  currentSearchTerm?: any

  constructor(
    private catalogueService: CatalogueService,
    private queryService: QueryService
  ) {
  }

  ngOnInit(): void {
    this.criteria = this.catalogueService.getCriteria(this.key)
    this.queryService.query$.subscribe(value => {
      const formerValue = this.queryService.read(this.key);
      if (formerValue != undefined) {
        this.currentCondition = formerValue
      } else {
        this.currentCondition = new Condition(
          this.criteria.key,
          this.criteria.allowedConditionTypes[0],
          this.criteria.system,
          (this.criteria.allowedConditionTypes[0] == "EQUALS") ? "" : [],
        )
      }
    })
  }

  onChange(display_short?: string){
    console.log(`This code is executed`)
    if (display_short) {
      this.currentCondition.display_short = display_short
    }
    if (this.currentCondition.isEmpty()) {
      this.queryService.delete(this.currentCondition);
    } else if (this.queryService.read(this.currentCondition.key)) {
      this.queryService.update(this.currentCondition);
    } else {
      this.queryService.create(this.currentCondition);
    }
  }

  autocomplete(event: {originalEvent: Event, query: string}) {
    if (event.query == "" || this.criteria.values == undefined) {
      this.suggestions = []
    } else if (this.criteria.values.length > 0) {
      if (event.query == "") {
        this.currentSearchTerm = undefined
        this.suggestions = this.criteria.values.map(value => value.key);
      } else {
        this.currentSearchTerm = event.query
        let baseSuggestions = this.criteria.values.filter(value => {
          return value.key.indexOf(event.query.toUpperCase()) != -1 || value.de.indexOf(event.query) != -1;
        })
        let wildcardSuggestions = this.computeWildcardSuggestions(baseSuggestions, event.query)
        this.suggestions = baseSuggestions
          .concat(wildcardSuggestions)
          .sort((a, b) => a.key.localeCompare(b.key)).map(value => value.key)
      }
    }
  }

  computeWildcardSuggestions(currentSuggestions: Array<{key: string, de: string, en: string}>, currentSearch: string): Array<{key: string, de: string, en: string, display_short: string}> {
    let wildcardSuggestions: Array<{key: string, de: string, en: string, display_short: string}> = [];
    currentSuggestions.forEach(child => {
      if (!wildcardSuggestions.some(
        code => code.key.startsWith(child.key.split(".")[0])
      )) {
        wildcardSuggestions.push({
          key: child.key,
          de: "",
          en: "",
          display_short: "",
        })
      }
    })
    // Remove matches following the .
    wildcardSuggestions = wildcardSuggestions.filter(code => code.key.split(".")[1]?.indexOf(currentSearch) == -1)
    wildcardSuggestions = wildcardSuggestions.map(code => {
      code.key = code.key.split(".")[0] + ".%"
      return code;
    })
    return wildcardSuggestions;
  }

  getSuggestionDisplay(suggestion: string): string {
    let foundDisplay = this.criteria.values?.find(value => value.key === suggestion)?.de;
    return (foundDisplay != undefined) ? foundDisplay : "";
  }

  addCondition() {
    // maybe extractable to query service?
    if (this.currentCondition != undefined && this.currentCondition instanceof Condition) {
      this.currentCondition = new Operation(
        "OR",
        [
          new Condition(
            this.criteria.key,
            this.currentCondition.type,
            this.currentCondition.system,
            this.currentCondition.value,
            'foo',
            'bar',
          ),
          new Condition(
            this.criteria.key,
            this.criteria.allowedConditionTypes[0],
            this.criteria.system,
            (this.criteria.allowedConditionTypes[0] == "EQUALS") ? "" : [],
            'bar',
            'foo',
          )
        ],
        this.criteria.key,
        this.criteria.displayName.de,
        this.criteria.displayName.en,
      )
    } else {
      this.currentCondition?.children.push(
        new Condition(
          this.criteria.key,
          this.criteria.allowedConditionTypes[0],
          this.criteria.system,
          (this.criteria.allowedConditionTypes[0] == "EQUALS") ? "" : []
        )
      )
    }
  }

  removeCondition(value: any) {
    if (this.currentCondition != undefined && this.currentCondition instanceof Operation) {
      this.currentCondition.children = this.currentCondition.children
        .map(child => <Condition> child)
        .filter(child => {
          return child.value!= value
        })
      // Switch back to normal condition if only one condition is left!
      if (this.currentCondition.children.length == 1 && this.currentCondition.children[0] instanceof Condition) {
        this.currentCondition = new Condition(
          this.criteria.key,
          this.currentCondition.children[0].type,
          this.currentCondition.children[0].system,
          this.currentCondition.children[0].value
        )
      }
    }
  }

  isCondition(value: any): value is Condition {
    return value instanceof Condition;
  }

  isOperation(value: any): value is Operation {
    return value instanceof Operation;
  }

  checkForWildcard() {
    if (this.currentCondition instanceof Operation) {
      this.currentCondition.children.map(child => {
        if (child instanceof Condition) {
          return this.switchConditionOnWildcard(child)
        } else {
          return child;
        }
      })
    } else {
      this.currentCondition = this.switchConditionOnWildcard(this.currentCondition)
    }
  }

  switchConditionOnWildcard(condition: Condition): Condition {
    if (typeof condition.value == "string") {
      if (condition.value.indexOf("%") != -1) {
        condition.type = "CONTAINS";
      } else {
        condition.type = "EQUALS";
      }
    }
    return condition
  }
}
