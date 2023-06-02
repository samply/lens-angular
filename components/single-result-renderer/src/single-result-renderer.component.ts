import {
  Component,
  Injector,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ResultRenderer,
  ResultRendererComponent
} from '@samply/lens-core';
import { SingleResultRendererDirective } from "./single-result-renderer.directive";

@Component({
  selector: 'lens-single-result-renderer',
  templateUrl: './single-result-renderer.component.html',
  styleUrls: ['./single-result-renderer.component.css']
})
export class SingleResultRendererComponent implements OnInit {

  @ViewChild(SingleResultRendererDirective, {static: true}) singleResultRenderer!: SingleResultRendererDirective

  @Input() public resultRenderer!: ResultRenderer;
  constructor() { }

  ngOnInit(): void {
    const viewContainerRef = this.singleResultRenderer.viewContainerRef;
    viewContainerRef.clear();
    let resultRendererInjector = Injector.create(
      {name: "ResultRendererProvider", providers: [{provide: ResultRenderer, useValue: this.resultRenderer}]}
    )
    let componentRef = viewContainerRef.createComponent<ResultRendererComponent>(this.resultRenderer.component, {injector: resultRendererInjector});
  }
}
