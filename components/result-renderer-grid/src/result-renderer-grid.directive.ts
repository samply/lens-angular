import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[lensResultRendererGrid]'
})
export class ResultRendererGridDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
