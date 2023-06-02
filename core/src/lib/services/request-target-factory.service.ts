import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RequestTarget} from "../model/request-target";

@Injectable({
  providedIn: 'root'
})
export class RequestTargetFactoryService {

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  create(requestTarget: RequestTarget): RequestTarget {
    requestTarget.client = this.httpClient
    return requestTarget
  }
}
