import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from "rxjs";
import { Query } from "../model/query";
import { Stratifier } from "../model/measure";

export class Collection {
  constructor(
    public biobankId: string,
    public name: string,
    public collectionId: string,
    public redirectUrl: string
    ) {
  }
}

export class NegotiatorResponse {
  constructor(
    public redirect_uri: URL
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class NegotiatorService {

  public siteToDefaultCollectionId: Map<string, string> = new Map<string, string>()
    .set("dresden", "bbmri-eric:ID:DE_BBD:collection:DILB")
    .set("frankfurt", "bbmri-eric:ID:DE_iBDF:collection:UCT")
    .set("wuerzburg", "bbmri-eric:ID:DE_ibdw:collection:bc")
    .set("brno", "bbmri-eric:ID:CZ_MMCI:collection:LTS")
    .set("aachen", "bbmri-eric:ID:DE_RWTHCBMB:collection:RWTHCBMB_BC")
    .set("leipzig", "bbmri-eric:ID:DE_LMB:collection:LIFE")
    .set("muenchen-hmgu", "bbmri-eric:ID:DE_Helmholtz-MuenchenBiobank:collection:DE_KORA")
    .set("Pilsen", "bbmri-eric:ID:CZ_CUNI_PILS:collection:serum_plasma")

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  generateBiobankCollection(selectedSites: Array<string>, custodianStartifier: Stratifier | undefined): Collection[] {
    let overallCollections: Collection[] = [];
    selectedSites.forEach(site => {
      let siteCollections: Collection[] = []
      let collectionId = "couldn't map site in search ui";
      if (this.siteToDefaultCollectionId.has(site)) {
        collectionId = this.siteToDefaultCollectionId.get(site)!
      }
      let siteId = collectionId.split(":collection:")[0]
      // TODO: Add a vanity URL here, that will redirect the browser to the local backends
      const localRedirectUri = "TODO: redirectUri";
      if (custodianStartifier != undefined) {
        siteCollections = siteCollections.concat(
          custodianStartifier.stratum
            .filter(stratum => {
              return stratum.key != null && stratum.key.indexOf(siteId) > -1
            })
            .map(stratum => {
              return new Collection(
                siteId,
                site,
                stratum.key,
                localRedirectUri
              )
            })
        )
      } else {
        siteCollections.push(
          new Collection(
            siteId,
            site,
            collectionId,
            localRedirectUri
          )
        )
      }
      overallCollections = overallCollections.concat(siteCollections);
    });
    return overallCollections;
  }

  sendRequestToNegotiator(query: Query, humanReadable: string, collections: Collection[]): Promise<NegotiatorResponse> {
    const negotiatorURL = `https://negotiator.bbmri-eric.eu/api/directory/create_query?nToken=${query.id}`;
    const headersNegotiator = new HttpHeaders()
      .set('Accept', 'application/json; charset=utf-8')
      .set('Content-Type', 'application/json');

    let base64Query = btoa(JSON.stringify(query))
    const returnURL = `${window.location.protocol}//${window.location.host}?nToken=${query.id}&query=${base64Query}`;

    return firstValueFrom(
      this.httpClient.post<NegotiatorResponse>(
        negotiatorURL,
        {
          humanReadable: humanReadable,
          URL: returnURL,
          nToken: query.id,
          collections: collections
        },{
          headers: headersNegotiator,
          responseType: 'json'
        }
      )
    );
  }
}
