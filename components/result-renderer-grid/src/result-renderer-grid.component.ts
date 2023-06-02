import {
  Component,
  Injector,
  Input,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {
  ResultRenderer,
  ResultRendererComponent
} from '@samply/lens-core';
import { ResultRendererGridDirective } from './result-renderer-grid.directive';

/**
 * Defines a Grid Based display of multiple Result Renderers.
 * */
@Component({
  selector: 'lens-result-renderer-grid',
  templateUrl: './result-renderer-grid.component.html',
  styleUrls: ['./result-renderer-grid.component.css']
})
export class ResultRendererGridComponent implements OnInit {

  @ViewChild(ResultRendererGridDirective, {static: true}) resultRendererGrid!: ResultRendererGridDirective

  /* the ResultRenderers displayed by this grid. */
  @Input()
  public resultRenderers: ResultRenderer[] = [];

  constructor(
    private renderer2: Renderer2
  ) { }
  ngOnInit(): void {
    this.loadResultRenderers()
  }

  loadResultRenderers() {
    const viewContainerRef = this.resultRendererGrid.viewContainerRef;
    viewContainerRef.clear();
    this.resultRenderers.forEach((resultRenderer) => {
      let resultRendererInjector = Injector.create(
        {name: "ResultRendererProvider", providers: [{provide: ResultRenderer, useValue: resultRenderer}]
        });
      let componentRef = viewContainerRef.createComponent<ResultRendererComponent>(resultRenderer.component, {injector: resultRendererInjector});
      if (resultRenderer.displayProperties.length > 0) {
        resultRenderer.displayProperties.forEach(displayProperty => this.renderer2.addClass(componentRef.location.nativeElement, displayProperty))
      }
    })
  }

}
