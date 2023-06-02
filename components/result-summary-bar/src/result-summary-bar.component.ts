import { Component } from '@angular/core';
import { ResultRendererComponent } from '@samply/lens-core';

/*
 * A Summary Bar that displays a selection of Results with icons.
 */
@Component({
  selector: 'lens-result-summary-bar',
  templateUrl: './result-summary-bar.component.html',
  styleUrls: ['./result-summary-bar.component.css']
})
export class ResultSummaryBarComponent extends ResultRendererComponent {

  public translateKey(key: string) {
    return (this.resultRenderer.headers.has(key))
      ? this.resultRenderer.headers.get(key)
      : key
  }

}
