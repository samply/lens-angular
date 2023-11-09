import {
  BehaviorSubject,
  Observable,
} from "rxjs";
import { HttpClient} from "@angular/common/http";
import { v4 as uuidv4 } from "uuid";
import { Blaze } from "./blaze";
import { RequestTarget, ResultRenderer } from "@samply/lens-core";

type Status = "claimed" | "succeeded" | "tempfailed" | "permfailed";

type Site = {
  status: Status,
  data: SiteData
}

type SiteData = {
  date: string,
  extension: object[],
  group: {
    code: {
      text: string
    },
    population: {
      count: number,
      code: {
        coding: {
          system: string
          code: string,
        }[]
      }
    }[]
    stratifier: {
      code: {
        text: string
      }[],
      stratum?: {
        population?: {
          count: number,
          code: {
            coding: {
              code: string,
              system: string
            }[]
          }
        }[],
        value: {
          text: string
        },
      }[],
    }[],
  }[],
  measure: string,
  period: object,
  resourceType: string,
  status: string,
  type: string,
}

interface BeamResult {
  from: string,
  to: Array<string>,
  task: string,
  status: Status,
  body: string,
  metadata: string
}

export class Beam implements RequestTarget {
  private resultSubject$: BehaviorSubject<Map<string, any>> = new BehaviorSubject<Map<string, any>>(new Map<string, any>())
  public results$: Observable<any> = this.resultSubject$.asObservable();

  public isLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject$.asObservable();

  public client!: HttpClient

  private currentTask?: string;
  private controller?: AbortController;
  private storeCache: Map<string, Site> = new Map<string, Site>();

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

    // ensure that we can cancel running requests
    if (this.controller) {
      this.controller.abort();
    }
    this.controller = new AbortController();

    this.resultSubject$.next(new Map<string, any>())

    const taskPromise = this.createBeamTask(query, measures, this.controller)

    return taskPromise;
  }

  private async createBeamTask(query: string, measures: Object[], controller: AbortController): Promise<string> {
    let baseCQL = btoa(unescape(encodeURIComponent(query)));

    let libUUID = uuidv4();
    let library = Blaze.buildLibrary(libUUID, baseCQL);

    let meaUUID = uuidv4();
    let measure = Blaze.buildMeasurement(libUUID, meaUUID, measures);

    let data = { lang: "cql", lib: library, measure: measure };

    const beamTaskResponse = await fetch(
      `${this.url}tasks?sites=${this.sites.toString()}`,
      {
        method: 'POST',
        credentials: (this.withCredentials) ? 'include' : 'same-origin',
        body: btoa(decodeURI(JSON.stringify(data))),
        signal: controller.signal
      }
    )

    if (!beamTaskResponse.ok) {
      const error = await beamTaskResponse.text()
      console.debug(`Received ${beamTaskResponse.status} with message ${error}`)
      throw new Error(`Unable to create new beam task.`)
    }


    this.currentTask = (await beamTaskResponse.json()).id;

    this.fetchResults(controller, this.currentTask)

    if (typeof this.currentTask !== 'string')
      return ""
    else
      return this.currentTask
  }

  private async fetchResults(controller: AbortController, currentTask?: string, ) {
    let responseCount: number = 0
    let continueRequests: boolean = false;

    do {

      const beamResponses: Response = await fetch(
        `${this.url}tasks/${this.currentTask}?wait_count=${responseCount + 1}`,
        {
          credentials: (this.withCredentials) ? 'include' : 'same-origin',
          signal: controller.signal
        }
      )

      if (!beamResponses.ok) {
        const error: string = await beamResponses.text()
        console.debug(`Received ${beamResponses.status} with message ${error}`)
        throw new Error(`Error then retrieving responses from Beam. Abborting requests ...`)
      }

      const beamResponseData: Array<BeamResult> = await beamResponses.json();

      let changes = new Map<string, Site>();
      beamResponseData.forEach((response: BeamResult) => {
        // exit if the response doesn't relate to the current query
        if (response.task !== currentTask) return
        let site: string = response.from.split(".")[1]
        let status: Status = response.status
        let body: SiteData = (status === "succeeded") ? JSON.parse(atob(response.body)) : null;
        // if the site is already in the store and the status is claimed, don't update the store
        if (this.storeCache.get(site)?.status === status) return;
        changes.set(site, { status: status, data: body });
      });


      if (changes.size > 0) {
        this.resultsReceived(beamResponseData)
      }

      this.storeCache = this.resultSubject$.value;

      responseCount = beamResponseData.length;
      let realResponseCount = beamResponseData.filter(response => response.status !== "claimed").length;
      console.log(`Received a total of ${responseCount} with ${responseCount - realResponseCount} claimed responses.`)

      if (
        (beamResponses.status === 200 || beamResponses.status === 206)
        && realResponseCount !== this.sites.length
      ) {
        continueRequests = true;
      } else {
        continueRequests = false;
        break;
      }

    } while (continueRequests)
    console.log(`Finished requesting results.`)
  }

  // This methods ensures the results are properly rendered!
  private resultsReceived(response: Array<BeamResult>) {
    let resultMap: Map<string, any> = new Map<string, any>();
    response.forEach(result => {
      resultMap.set(result.from.split(".")[1], result)
    })
    this.resultSubject$.next(resultMap)
  }
}
