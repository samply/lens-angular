import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[lensSingleResultRenderer]'
})
export class SingleResultRendererDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
