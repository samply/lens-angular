import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NegotiateButtonComponent } from './negotiate-button.component';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TagModule} from "primeng/tag";



@NgModule({
    declarations: [
        NegotiateButtonComponent
    ],
    exports: [
        NegotiateButtonComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        RippleModule,
        TagModule
    ]
})
export class NegotiateButtonModule { }
