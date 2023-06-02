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
  ConditionTypes,
  Criteria
} from '@samply/lens-core';

@Component({
  selector: 'lens-boolean-condition-builder',
  templateUrl: './boolean-condition-builder.component.html',
  styleUrls: ['./boolean-condition-builder.component.css']
})
export class BooleanConditionBuilderComponent implements OnInit {

  @Input() key: string = '';
  @Output() conditionChange: EventEmitter<Condition> = new EventEmitter<Condition>();

  criteria!: Criteria
  selectedCondition: ConditionTypes = "EQUALS";
  currentConditionValue: boolean = false;

  constructor(
    private catalogueService: CatalogueService,
    private queryService: QueryService
  ) {
  }

  ngOnInit(): void {
    this.criteria = this.catalogueService.getCriteria(this.key)
    this.queryService.query$.subscribe(value => {
      let formerValue = this.queryService.read(this.key);
      if (formerValue != undefined && formerValue instanceof Condition) {
        this.selectedCondition = formerValue.type;
        if (typeof formerValue.value == "boolean") {
          this.currentConditionValue = <boolean> formerValue.value;
        }
      } else {
        this.currentConditionValue = false
      }
    })
  }

  onChange() {
    this.conditionChange.emit(
      new Condition(
        this.key,
        this.selectedCondition,
        this.criteria.system,
        this.currentConditionValue
      )
    )
  }

}
