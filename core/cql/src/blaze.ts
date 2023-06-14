import {HttpClient, HttpHeaders} from "@angular/common/http";
import { RequestTarget } from "@samply/lens-core";
import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {v4 as uuidv4} from "uuid";

export class Blaze implements RequestTarget {

  private httpHeaders: HttpHeaders;

  private resultsSubject$: BehaviorSubject<Map<string, any>> = new BehaviorSubject<Map<string, any>>(new Map<string, any>());
  public results$: Observable<any> = this.resultsSubject$.asObservable();

  public isLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject$.asObservable();

  public client!: HttpClient

  constructor(
    public key: string,
    public url: URL,
    public auth: string = "",
  ) {
    this.httpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/json');
  }

  async send(query: string, measures: Object[]): Promise<string> {
    this.resultsSubject$.next(new Map<string, any>())

    let baseCQL = btoa(unescape(encodeURIComponent(query)));
    let libUUID = uuidv4();
    let library = Blaze.buildLibrary(libUUID, baseCQL);

    let meaUUID = uuidv4();
    let measure = Blaze.buildMeasurement(libUUID, meaUUID, measures);

    if (this.auth != "") {
      this.httpHeaders.append("Authorization", this.auth);
    }

    const httpOptions = {
      headers: this.httpHeaders
    };

    this.isLoadingSubject$.next(true);

    let libResult = await firstValueFrom(
      this.client.post<any>(this.url.toString() + 'fhir/Library', library, httpOptions)
      .pipe(catchError(err => {
        this.isLoadingSubject$.next(false);
        throw `Error then creating library ${libUUID} at ${this.url}`;
      })));
    let meaResult = await firstValueFrom(
      this.client.post<any>(this.url.toString() + 'fhir/Measure', measure, httpOptions)
      .pipe(catchError(err => {
        this.isLoadingSubject$.next(false);
        throw `Error then creating measure ${meaUUID} at ${this.url}`;
      })));
    let result = await firstValueFrom(
      this.client.get(this.url.toString() + 'fhir/Measure/$evaluate-measure?measure=' + meaResult.url + '&periodStart=2000&periodEnd=2030', httpOptions)
      .pipe(catchError(err => {
        this.isLoadingSubject$.next(false);
        throw `Error then requesting results for ${measure.url} at ${this.url}`;
      })));

    this.resultsSubject$.next(new Map<string, any>([[this.key, result]]))
    this.isLoadingSubject$.next(false);
    return meaUUID;
  }

  public static buildLibrary(libUUID: any, baseCQL: string) {
    return {
      "resourceType": "Library",
      "url": "urn:uuid:" + libUUID,
      "status": "active",
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/library-type",
            "code": "logic-library"
          }
        ]
      },
      "content": [
        {
          "contentType": "text/cql",
          "data": baseCQL
        }
      ]
    };
  }

  public static buildMeasurement(libUUID: any, meaUUID: any, measures: Object[]) {
    return {
      "resourceType": "Measure",
      "url": "urn:uuid:" + meaUUID,
      "status": "active",
      "subjectCodeableConcept": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/resource-types",
            "code": "Patient"
          }
        ]
      },
      "library": "urn:uuid:" + libUUID,
      "scoring": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/measure-scoring",
            "code": "cohort"
          }
        ]
      },
      "group": measures // configuration.resultRequests.map(request => request.measures)
    }
  }
}
