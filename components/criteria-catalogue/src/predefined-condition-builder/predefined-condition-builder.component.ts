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
  ConditionTypes,
  Criteria,
  Operation
} from '@samply/lens-core';

@Component({
  selector: 'lens-predefined-condition-builder',
  templateUrl: './predefined-condition-builder.component.html',
  styleUrls: ['./predefined-condition-builder.component.css']
})
export class PredefinedConditionBuilderComponent implements OnInit {

  @Input() key: string = '';
  @Output() operationChange: EventEmitter<Operation> = new EventEmitter<Operation>();

  criteria!: Criteria
  selectedCondition: ConditionTypes = "EQUALS";
  selectedOperations: Array<Operation> = [];

  private previousSelectedCount = 0;

  constructor(
    private catalogueService: CatalogueService,
    private queryService: QueryService
  ) {
  }

  ngOnInit(): void {
    this.criteria = this.catalogueService.getCriteria(this.key);
    this.queryService.query$.subscribe(value => {
      let formerValue = this.queryService.read(this.key)
      if (formerValue != undefined && formerValue instanceof Operation) {
        let updatedSelectedOperations: Array<Operation> = []
        formerValue.children.forEach(child => {
          if (child instanceof Operation) {
            updatedSelectedOperations = updatedSelectedOperations.concat(child);
          }
        })
        this.selectedOperations = updatedSelectedOperations
      } else {
        this.selectedOperations = [];
      }
    })
  }

  onChange(){
    let completeOperation = new Operation(
      "OR",
      [],
      this.criteria.key,
      this.criteria.displayName.de,
      this.criteria.displayName.en
    );
    this.selectedOperations.forEach(operation => {
      completeOperation.children = completeOperation.children.concat(operation)
    })
    if (this.previousSelectedCount == 0) {
      this.queryService.create(completeOperation)
      this.previousSelectedCount = 1;
    } else {
      if (this.selectedOperations.length == 0) {
        this.queryService.delete(completeOperation);
        this.previousSelectedCount = 0
      } else {
        this.queryService.update(completeOperation)
        this.previousSelectedCount = this.selectedOperations.length
      }
    }
  }

}
