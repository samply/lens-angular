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

  @ViewChild(ResultRendererGridDirective, { static: true }) resultRendererGrid!: ResultRendererGridDirective

  /* the ResultRenderers displayed by this grid. */
  @Input()
  public resultRenderers: ResultRenderer[] = [];

  private componentRefs: Array<any> = [];

  constructor(
    private renderer2: Renderer2,
    private queryService: QueryService
  ) {
    this.queryService.transformedResults$.subscribe(results => {
      if (!this.queryService.isModified())
        this.updateComponents()
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
        {
          name: "ResultRendererProvider", providers: [{ provide: ResultRenderer, useValue: resultRenderer }]
        });
      const componentRef = viewContainerRef.createComponent<ResultRendererComponent>(resultRenderer.component, { injector: resultRendererInjector });
      this.updateComponentVisibility(componentRef)
      if (resultRenderer.displayProperties.length > 0) {
        resultRenderer.displayProperties.forEach(displayProperty => this.renderer2.addClass(componentRef.location.nativeElement, displayProperty))
      }
      this.componentRefs.push(componentRef)
    })
  }

  /** update all components */
  updateComponents() {
    this.componentRefs.forEach((componentRef) => {
      this.updateComponentVisibility(componentRef)
    })
  }

  /** update the visibility of a single grid component */
  updateComponentVisibility(componentRef: any) {
    const resultRenderer = componentRef.instance.resultRenderer;
    console.log(`${resultRenderer.title}: ${this.showResultRenderer(resultRenderer)}`)
    if (this.showResultRenderer(resultRenderer)) {
      this.renderer2.removeClass(componentRef.location.nativeElement, "dontshow");
    } else {
      this.renderer2.addClass(componentRef.location.nativeElement, "dontshow");
    }
  }

  /** returns true if result renderer grid should draw this result renderer */
  showResultRenderer(resultRenderer: ResultRenderer): boolean {
    if (resultRenderer.showOn.length === 0
      && resultRenderer.dontShowOn.length === 0)
      return true;
    if (this.partOfQuery(resultRenderer.dontShowOn))
      return false;
    if (this.partOfQuery(resultRenderer.showOn)
      || resultRenderer.showOn.length === 0)
      return true;
    return false;
  }

  /**  returns true when any element of the array has a matching key in query */
  partOfQuery(elements: Array<string>): boolean {
    return elements.some(element => {
      if (element === "empty-query" && this.queryService.isEmpty())
        return true;
      return this.queryService.read(element) !== undefined;
    })
  }

}
