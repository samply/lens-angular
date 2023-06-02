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
    // TODO: Add possibility to switch between HttpClient and Listening to a WebSocket
    requestTarget.client = this.httpClient
    return requestTarget
  }
}
