import {Observable} from "rxjs";
import {Category} from "./category";

export interface CatalogueFetcher {
  fetch(): Observable<Array<Category>>
}
