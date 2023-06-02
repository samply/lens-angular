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

@Component({
  selector: 'lens-number-condition-builder',
  templateUrl: './number-condition-builder.component.html',
  styleUrls: ['./number-condition-builder.component.css']
})
export class NumberConditionBuilderComponent implements OnInit {

  @Input() key: string = '';
  @Output() conditionChange: EventEmitter<Condition> = new EventEmitter<Condition>();

  criteria!: Criteria;
  currentCondition!: Condition;

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
          (this.criteria.allowedConditionTypes[0] == "EQUALS") ? 0 : {min: 0, max: 0}
        )
      }
    })
  }

  onChange() {
    if (this.currentCondition.value instanceof Number) {
      this.currentCondition.type = "EQUALS"
    } else if (typeof this.currentCondition.value == "object" && !(this.currentCondition.value instanceof Array)) {
      if (this.currentCondition.value.min != 0 && this.currentCondition.value.max != 0){
        this.currentCondition.type = "BETWEEN"
      } else if (this.currentCondition.value.max != 0) {
        this.currentCondition.type = "LOWER_THAN"
      } else if (this.currentCondition.value.min != 0) {
        this.currentCondition.type = "GREATER_THAN"
      }
    }
    this.conditionChange.emit(
      // NOTE: We can't emit this.currentCondition here because otherwise the query won't register correctly the change
      new Condition(
        this.currentCondition.key,
        this.currentCondition.type,
        this.currentCondition.system,
        this.currentCondition.value
      )
    )
  }

}
