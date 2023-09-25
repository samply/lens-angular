import {
  BehaviorSubject,
  firstValueFrom,
  map,
  Observable,
  retry,
  throwError
} from "rxjs";
import {HttpClient, HttpResponse } from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {v4 as uuidv4} from "uuid";
import {Buffer} from 'buffer';
import { Blaze } from "./blaze";
import { RequestTarget } from "@samply/lens-core";

interface BeamResult {
  from: string,
  to: Array<string>,
  task: string,
  status: string,
  body: string,
  metadata: string
}

interface BeamTask {
  id: string
}

export class Beam implements RequestTarget {
  private resultSubject$: BehaviorSubject<Map<string, any>> = new BehaviorSubject<Map<string, any>>(new Map<string, any>())
  public results$: Observable<any> = this.resultSubject$.asObservable();

  public isLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject$.asObservable();

  public client!: HttpClient
  private currentTask?: BeamTask;

  constructor(
    public key: string,
    public url: URL,
    // List of sites that should be called through this instance of Beam
    public sites: Array<string>,
    // Determines wether Access-Control Requests during CORS will send cookies etc.
    public withCredentials: boolean = true
  ) {
  }

  async send(query: string, measures: Object[]): Promise<string> {
    this.resultSubject$.next(new Map<string, any>())

    let baseCQL = btoa(unescape(encodeURIComponent(query)));

    let libUUID = uuidv4();
    let library = Blaze.buildLibrary(libUUID, baseCQL);

    let meaUUID = uuidv4();
    let measure = Blaze.buildMeasurement(libUUID, meaUUID, measures);

    let data = {lang: "cql", lib: library, measure: measure};

    this.currentTask = await firstValueFrom(
      this.client.post<BeamTask>(
        this.url.toString() + "tasks?sites=" + this.sites.toString(),
        Buffer.from(JSON.stringify(data)).toString('base64').trimEnd(),
        {
          withCredentials: this.withCredentials
        }
      ).pipe(catchError(err => {
        console.error(`Received error then creating a new Beam Task through spot!`)
        return throwError(err);
      }))
    );
    console.log(`Created new Beam Task with id ${this.currentTask.id} at ${this.key}`)

    this.queryBackendForResults(this.currentTask.id);

    return this.currentTask.id
  }

  private async queryBackendForResults(taskId: string) {
    this.isLoadingSubject$.next(true);

    console.log(`Requesting results from ${this.sites.length} sites through ${this.key}`)
    for (let i = 1; i <= this.sites.length; i++) {
      let retryCounter = 0;
      let response: HttpResponse<BeamResult[]> = await firstValueFrom(this.client.get<Array<BeamResult>>(
        this.url.toString() + `tasks/${this.currentTask?.id}?wait_count=${i}`,
        {
          observe: "response",
          withCredentials: this.withCredentials
        }
      ).pipe(
        map(response => {
          if (response.status === 206) {
            retryCounter += 1;
            console.log(`Request for ${i} results with query ${this.currentTask?.id} timed out for the ${retryCounter} time!`)
            throw response;
          } else if (response.status >= 500) {
            retryCounter += 1;
            console.log(`Retrying query ${this.currentTask?.id} for the ${retryCounter} time because of server error ${response.status}`)
            throw response;
          }
          retryCounter = 0;
          return response
        }),
        retry({count: 15, delay: 0, resetOnSuccess: true})
      )).catch(error => {
          if (error.status === 206) {
            console.log(`Aborting to request additional results for query ${this.currentTask?.id} as no new results were added during ${retryCounter} retries.`)
          } else {
            console.log(`Aborting to request additional results for query ${this.currentTask?.id} due to error ${error.status}.`)
          }
          return error
        }
      );
      if (response.status == 200) {
        console.log(`Received new partial result for query ${this.currentTask?.id} with results from ${i} sites.`)
        if (response.body !== undefined && response.body !== null) {
          i = response.body
            .filter(test => test.status !== "claimed").length;
          let receivedTask = response.body[0].task;
          if (this.currentTask !== undefined && receivedTask.indexOf(this.currentTask.id) !== -1) {
            this.resultsReceived(response)
          } else {
            console.warn(`Throwing away response for old query ${receivedTask} in favor of new query ${this.currentTask?.id}`)
          }
        }
      }
      // add a little delay between requests so diagrams won't change to fast
      await new Promise(f => setTimeout(f, 850))
    }
    console.log(`Finished requesting results for query ${this.currentTask?.id}`)
    this.isLoadingSubject$.next(false);
  }

  // This methods ensures the results are properly rendered!
  private resultsReceived(response: HttpResponse<Array<BeamResult>>) {
    if (response.body instanceof Array) {
      let resultMap: Map<string, any> = new Map<string, any>();
      response.body.filter(result => {
        if (result.status == "permfailed" || result.status == "tempfailed") {
          console.warn(`Site ${result.from} returned status ${result.status}. Therefore ignoring their result!`)
          return false;
        } else if (result.status == "claimed") {
          console.info(`Site ${result.from} claimed the request`)
          return false
        } else {
          return true;
        }
      }).forEach(result => {
        resultMap.set(result.from.split(".")[1], JSON.parse(Buffer.from(result.body, 'base64').toString('binary')))
      })
      this.resultSubject$.next(resultMap)
    }
  }
}
