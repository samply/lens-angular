import {
  Component,
  Inject
} from '@angular/core';
import {
  LensConfig,
  LENS_CONFIG_TOKEN,
  QueryService
} from '@samply/lens-core';
// TODO: The import of this submodule doesn't seem to work, needs further invesitagtion
// import { Beam } from '@samply/lens-core/beam';

@Component({
  selector: 'lens-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.css']
})
export class LoadingBarComponent {

  /* number between zero and 100 to indicate the number of responses */
  public responsePercentage: number = 0;

  public isLoading: boolean = false;

  /* number of all expected request targets */
  private readonly requestTargetCount: number

  constructor(
    @Inject(LENS_CONFIG_TOKEN) private configuration: LensConfig,
    private queryService: QueryService
  ) {
    this.requestTargetCount = this.configuration.requestTargets.reduce((aggregator, target) => {
      // if (target instanceof Beam) {
      //   return aggregator + target.sites.length;
      // }
      return aggregator + 1;
    }, 0);
    this.queryService.resultsLoading$.subscribe(next => this.onResultLoading(next))
    this.queryService.results$.subscribe(next => this.onResults(next))
  }

  isIndeterminate(): string {
    return (this.isLoading && this.responsePercentage === 0)
      ? 'indeterminate'
      : 'determinate';
  }

  onResultLoading(resultLoading: boolean) {
    this.isLoading = resultLoading;
  }

  // compute the percentage when receiving new results
  onResults(results: Map<string, any>) {
    this.responsePercentage = (results.size / this.requestTargetCount) * 100
  }

}
