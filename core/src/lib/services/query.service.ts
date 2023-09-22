import {Inject, Injectable} from '@angular/core';
import {QueryTranslator, QUERY_TRANSLATOR_TOKEN} from "../model/query-translator";
import {ResultTransformer, RESULT_TRANSFORMER_TOKEN} from "../model/result-transformer";
import {Operation} from "../model/operation";
import {Measure} from "../model/measure";
import {LensConfig, LENS_CONFIG_TOKEN} from "../lens-config";
import {Query} from "../model/query";
import {Condition} from "../model/condition";
import {BehaviorSubject, debounceTime} from "rxjs";
import {RequestTargetFactoryService} from "./request-target-factory.service";
import {NegotiatorService} from "./negotiator.service";
import { ChipTransformPipe } from '../pipes/chip-transform.pipe';


@Injectable({
  providedIn: 'root'
})
export class QueryService {

  private querySubject$ = new BehaviorSubject<Query>(
    new Query()
  );
  public query$ = this.querySubject$.asObservable();

  private resultsSubject$ = new BehaviorSubject<Map<string, any>>(new Map<string, any>());
  public results$ = this.resultsSubject$.asObservable();

  private transformedResultsSubject$ = new BehaviorSubject<Array<Measure>>([]);
  public transformedResults$ = this.transformedResultsSubject$.asObservable();

  private resultsLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public resultsLoading$ = this.resultsLoadingSubject$.asObservable();

  public selectedNegotiationPartnersSubject$ = new BehaviorSubject<Array<string>>([]);
  public selectedNegotiationPartners$ = this.selectedNegotiationPartnersSubject$.asObservable();

  public latestQuery?: Query;

  constructor(
    @Inject(QUERY_TRANSLATOR_TOKEN) private queryTranslator: QueryTranslator,
    @Inject(RESULT_TRANSFORMER_TOKEN) private resultTransformer: ResultTransformer,
    @Inject(LENS_CONFIG_TOKEN) private configuration: LensConfig,
    private requestTargetFactory: RequestTargetFactoryService,
    private chipTransform: ChipTransformPipe,
    private negotiatorService: NegotiatorService
  ) {
    // Enable transformation of incoming results
    this.resultsSubject$.subscribe(results => {
      console.log(`New results are received, therefore triggering transformation!`)
      this.transformedResultsSubject$.next(this.resultTransformer.transform(results))
    })
    this.configuration.requestTargets.forEach(requestTarget => {
      requestTarget.isLoading$.subscribe(next => this.onRequestTargetIsLoading())
      requestTarget.results$
        .pipe(debounceTime(1000))
        .subscribe({
          next: result => {
            let currentResults = this.resultsSubject$.value;
            result.forEach((value, key) => {
              currentResults.set(key, value);
            })
            this.resultsSubject$.next(currentResults);
          }
        })
    })
  }

  public async send() {
    // NOTE: In addition to this reset, each request target implementation needs to reset their results (see blaze.ts and beam.ts)
    this.resultsSubject$.next(new Map<string, any>())
    console.log(this.querySubject$.value)
    let transformedQuery = this.queryTranslator.transform(this.querySubject$.value.ast);
    console.log(transformedQuery)
    this.querySubject$.value.tasks = await Promise.all(
      this.configuration.requestTargets
      // create instance of requestTarget
      .map(requestTarget => {
        return this.requestTargetFactory.create(requestTarget)
      })
      // send the request and keep the task-id
      .map(async requestTarget => {
        return {
          key: requestTarget.key,
          task: await requestTarget.send(
            JSON.stringify(this.querySubject$.value),
            this.configuration.resultRequests.map(request => request.measure)
          )
        }
      })
    )
    // Ensure Backtracking of Queries
    this.latestQuery = this.querySubject$.value;
    this.querySubject$.next(new Query(this.querySubject$.value.ast))
  }

  public async download() {
    let queryString = JSON.stringify(this.querySubject$.value.ast, null, 2);
    let measureString = JSON.stringify(this.transformedResultsSubject$.value, null, 2);
    let responseString = `${queryString}\n\n${measureString}`;
    let uriContent = URL.createObjectURL(new Blob([responseString], {type : 'text/plain'}))
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', uriContent);
    link.setAttribute('download', `lens-query-${this.querySubject$.value.id}.txt`);
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  public clear() {
    this.querySubject$.next(
      new Query(
        new Operation(
          "AND",
          [],
          "main",
          "haupt",
          "main"
        )
      ))
  }

  public isModified(): boolean {
    return this.latestQuery == undefined
      || (this.querySubject$.value.ast != this.latestQuery.ast);
  }

  public isEmpty(): boolean {
    return this.querySubject$.value.ast.isEmpty();
  }

  public create(element: Condition | Operation) {
    let updatedAst = new Operation(
      this.querySubject$.value.ast.operand,
      [...this.querySubject$.value.ast.children, element],
      "main",
      "haupt",
      "main"
    )
    this.querySubject$.next(new Query(updatedAst))
  }

  public read(key: string): Condition | Operation | undefined{
    return this.querySubject$.value.ast.find(key)
  }

  public update(element: Condition | Operation) {
    let updatedAst = new Operation(
      this.querySubject$.value.ast.operand,
      this.querySubject$.value.ast.children.map(child => {
        if (child.key === element.key) {
          return element;
        }
        return child;
      }),
      "main",
      "haupt",
      "main"
    )
    this.querySubject$.next(new Query(updatedAst))
  }

  public delete(element: Condition | Operation | string) {
    let updatedAst = new Operation(
      this.querySubject$.value.ast.operand,
      this.querySubject$.value.ast.children.filter(child => {
        if (typeof element == "string") {
          console.log(`Using the new comparison, comparing ${element} with ${child.key} and receiving ${element !== child.key}`)
          return element !== child.key
        } else {
          return element.key !== child.key
        }
      }),
      "main",
      "haupt",
      "main"
    )
    this.querySubject$.next(new Query(updatedAst))
  }

  async sendNegotiationRequest(sitesToNegotiate: string[]) {
    let humanReadable = this.getHumanReadableQuery();
    let custodianStratifier = this.transformedResultsSubject$.value
      .find(measure => measure.key == "patients")?.findStratifier("Custodian");
    let collections = this.negotiatorService.generateBiobankCollection(sitesToNegotiate, custodianStratifier)
    let negotiatorResponse = await this.negotiatorService.sendRequestToNegotiator(this.querySubject$.value, humanReadable, collections)
    window.location.href = negotiatorResponse.redirect_uri.toString()
  }

  loadQuery(queryId: string, base64Query: string) {
    let jsonQuery = JSON.parse(atob(base64Query));
    let queryToBeLoaded = <Query> jsonQuery;
    queryToBeLoaded.id=queryId;
    queryToBeLoaded.ast = Operation.load(queryToBeLoaded.ast);
    let loadedQuery = Object.assign(new Query(), queryToBeLoaded);
    this.querySubject$.next(loadedQuery);
  }

  public getHumanReadableQuery(): string{

    let humanReadableQuery: string = "";

    if (this.querySubject$.value === undefined){
      return humanReadableQuery
    }
    this.querySubject$.value.ast.children.forEach(criterion => {
      humanReadableQuery += this.chipTransform.transform(criterion).replace(",", " or ") + " and "
    })

    humanReadableQuery = humanReadableQuery.slice(0, -5)

    return humanReadableQuery
  }

  /* sets result loading to true, if any of the requests targets is still loading */
  private onRequestTargetIsLoading() {
    this.resultsLoadingSubject$.next(
      this.configuration.requestTargets.some(target => target.isLoadingSubject$.value)
    )
  }
}
