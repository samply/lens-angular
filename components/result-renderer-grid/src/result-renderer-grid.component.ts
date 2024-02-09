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
  ResultRendererComponent,
  QueryService
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

  private componentRefs: Array<any> = [];

  constructor(
    private renderer2: Renderer2,
    private queryService: QueryService
  ) {
    this.queryService.transformedResults$.subscribe(results => {
      if(!this.queryService.isModified())
        this.updateDiagramVisibility();
    })
  }

  ngOnInit(): void {
    this.loadResultRenderers()
  }

  loadResultRenderers() {
    const viewContainerRef = this.resultRendererGrid.viewContainerRef;
    viewContainerRef.clear();
    this.resultRenderers.forEach((resultRenderer) => {
      const resultRendererInjector = Injector.create(
        {name: "ResultRendererProvider", providers: [{provide: ResultRenderer, useValue: resultRenderer}]
        });
      const componentRef = viewContainerRef.createComponent<ResultRendererComponent>(resultRenderer.component, {injector: resultRendererInjector});
      if (resultRenderer.showOn != undefined
        && !this.showComponent(resultRenderer.showOn)) {
        this.renderer2.addClass(componentRef.location.nativeElement, "dontshow");
      } else {
        this.renderer2.removeClass(componentRef.location.nativeElement, "dontshow");
      }
      if (resultRenderer.displayProperties.length > 0) {
        resultRenderer.displayProperties.forEach(displayProperty => this.renderer2.addClass(componentRef.location.nativeElement, displayProperty))
      }
      this.componentRefs.push(componentRef)
    })
  }

  updateDiagramVisibility() {
    this.componentRefs.forEach((componentRef) => {
      const resultRenderer = componentRef.instance.resultRenderer;
      if (resultRenderer.showOn != undefined
         && !this.showComponent(resultRenderer.showOn)) {
         this.renderer2.addClass(componentRef.location.nativeElement, "dontshow");
       } else {
         this.renderer2.removeClass(componentRef.location.nativeElement, "dontshow");
       }
    })
  }

  showComponent(showOn: Array<string>): boolean {
    if (showOn.length === 0) return true;
    return showOn.some(condition => {
      if (condition === "empty-query" && this.queryService.isEmpty())
        return true;
      return this.queryService.read(condition) !== undefined;
    })
  }

}
