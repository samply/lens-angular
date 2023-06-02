import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  CatalogueService,
  QueryService,
  Condition,
  Criteria
} from '@samply/lens-core';

/*
* This component lets the user define conditions based on dates.
* Supported ConditionTypes:
*   "GREATER_THAN", "LOWER_THAN", "BETWEEN"
* Example:
* new Criteria(
*    "sampling_date",
*    {de: "Probenahmedatum", en: "Sampling date"},
*    "date",
*    "",
*    ["LOWER_THAN", "GREATER_THAN", "BETWEEN"],
* )
 */
@Component({
  selector: 'lens-date-condition-builder',
  templateUrl: './date-condition-builder.component.html',
  styleUrls: ['./date-condition-builder.component.css']
})
export class DateConditionBuilderComponent implements OnInit {

  @Input() key: string = '';
  @Output() conditionChange: EventEmitter<Condition> = new EventEmitter<Condition>();

  criteria!: Criteria;
  currentCondition!: Condition

  constructor(
    private catalogueService: CatalogueService,
    private queryService: QueryService
  ) { }

  ngOnInit(): void {
    this.criteria = this.catalogueService.getCriteria(this.key);
    this.queryService.query$.subscribe(value => {
      let formerValue = this.queryService.read(this.key);
      if (formerValue != undefined && formerValue instanceof Condition) {
        this.currentCondition = formerValue;
      } else {
        this.currentCondition = new Condition(
          this.criteria.key,
          this.criteria.allowedConditionTypes[0],
          this.criteria.system,
          {min: undefined, max: undefined},
        )
      }
    })
  }

  onChange() {
    // TODO: onInput would fire without pressing "ENTER", search a way for updating ngModel according to new value passed as $event.value
    if (this.currentCondition != undefined && typeof this.currentCondition.value == "object"
      && !(this.currentCondition.value instanceof Array)){
      if (this.currentCondition.value.min != undefined && this.currentCondition.value.max != undefined) {
        this.currentCondition.type = "BETWEEN"
      } else if (this.currentCondition.value.max != undefined) {
        this.currentCondition.type = "LOWER_THAN"
      } else if (this.currentCondition.value.min != undefined) {
        this.currentCondition.type = "GREATER_THAN"
      }
    }
    this.conditionChange.emit(
      new Condition(
        this.currentCondition.key,
        this.currentCondition.type,
        this.currentCondition.system,
        this.currentCondition.value,
      )
    )
  }


}
