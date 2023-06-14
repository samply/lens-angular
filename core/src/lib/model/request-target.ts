import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

/**
 * This class represents a single party, that is called upon search requests by the user.
 * It is only intended for inheritance, so developers will need to extend the */
export interface RequestTarget {

  /** Observable for interested parties to subscribe to any result received from this request target */
  results$: Observable<Map<string, any>>;
  /** BehaviorSubject for results still loading for this request target */
  isLoadingSubject$: BehaviorSubject<boolean>;
  /** Observable for results still loading for this request target */
  isLoading$: Observable<boolean>;
  /** Client used by this request target for backend requests. It will eventually be injected by the RequestTargetFactory */
  client: HttpClient;
  /** key identifying this request target */
  key: string;
  /** url to the request target */
  url: URL;

  /** Send the query to the target presented by this instance */
  send(query: String, measures: Object[]): Promise<string>;
}
