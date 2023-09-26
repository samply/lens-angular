import {v4 as uuidv4} from "uuid";
import {Buffer} from 'buffer';
import { Blaze } from "./blaze";
import { RequestTarget } from "@samply/lens-core";
import { BehaviorSubject, catchError, firstValueFrom, Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

interface BeamResult {
  from: string,
  to: Array<string>,
  task: string,
  status: string,
  body: string,
  metadata: string
}


export class BeamSse implements RequestTarget {
  private resultSubject$: BehaviorSubject<Map<string, any>> = new BehaviorSubject<Map<string, any>>(new Map<string, any>())
  public results$: Observable<any> = this.resultSubject$.asObservable();

  public isLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject$.asObservable();

  public client!: HttpClient

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
    console.debug(`send running withCredentials: ${this.withCredentials}`)
    this.resultSubject$.next(new Map<string, any>())

    let baseCQL = btoa(unescape(encodeURIComponent(query)));

    let libUUID = uuidv4();
    let library = Blaze.buildLibrary(libUUID, baseCQL);

    let meaUUID = uuidv4();
    let measure = Blaze.buildMeasurement(libUUID, meaUUID, measures);

    let data = {lang: "cql", lib: library, measure: measure};

    let taskId = uuidv4();

    await firstValueFrom(
      this.client.post(
        this.url.toString() + "beam",
        {
          id: taskId,
          sites: this.sites,
          query: Buffer.from(JSON.stringify(data)).toString('base64').trimEnd(),
        },
        {
          withCredentials: this.withCredentials
        }
      ).pipe(catchError(err => {
        console.error(`Received error then creating a new Beam Task through spot!`)
        return throwError(err);
      }))
    );

    console.log(`Created new Beam Task with id ${taskId} at ${this.key}`)

    let eventSource = new EventSource(`${this.url.toString()}beam/${taskId}?wait_count=${this.sites.length}`)
    eventSource.addEventListener("new_result", (message) => {
      console.log(`received new_result: ${message}`)
    })

    return taskId;
  }

}
