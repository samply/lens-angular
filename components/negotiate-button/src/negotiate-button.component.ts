import { Component, OnInit } from '@angular/core';
import { QueryService, ColorScheme } from '@samply/lens-core';

@Component({
  selector: 'lens-negotiate-button',
  templateUrl: './negotiate-button.component.html',
  styleUrls: ['./negotiate-button.component.css']
})
export class NegotiateButtonComponent implements OnInit {

  selectedNegotiationPartners: Array<string> = [];

  colors: ColorScheme = new ColorScheme();

  constructor(
    private queryService: QueryService
  ) {
    queryService.selectedNegotiationPartners$.subscribe(next => this.onNegotiationPartnersChanged(next));
  }

  ngOnInit(): void {
  }

  sendNegotiationRequest() {
    this.queryService.sendNegotiationRequest(this.selectedNegotiationPartners)
  }

  private onNegotiationPartnersChanged(next: Array<string>) {
    this.selectedNegotiationPartners = next;

  }

  public isQueryModified() {
    return this.queryService.latestQuery != undefined && this.queryService.isModified()
  }
}
