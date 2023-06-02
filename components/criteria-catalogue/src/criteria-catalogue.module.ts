import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CriteriaCatalogueComponent } from './criteria-catalogue.component';
import {TreeModule} from "primeng/tree";
import {FormsModule} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";
import {PanelModule} from "primeng/panel";
import {SliderModule} from "primeng/slider";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {AutoCompleteModule} from "primeng/autocomplete";
import {CalendarModule} from "primeng/calendar";
import {ButtonModule} from "primeng/button";
import { StringConditionBuilderComponent } from './string-condition-builder/string-condition-builder.component';
import { BooleanConditionBuilderComponent } from './boolean-condition-builder/boolean-condition-builder.component';
import { NumberConditionBuilderComponent } from './number-condition-builder/number-condition-builder.component';
import { DateConditionBuilderComponent } from './date-condition-builder/date-condition-builder.component';
import { PredefinedConditionBuilderComponent } from './predefined-condition-builder/predefined-condition-builder.component';
import { LensCoreModule } from '@samply/lens-core';



@NgModule({
  declarations: [
    CriteriaCatalogueComponent,
    StringConditionBuilderComponent,
    BooleanConditionBuilderComponent,
    NumberConditionBuilderComponent,
    DateConditionBuilderComponent,
    PredefinedConditionBuilderComponent
  ],
  imports: [
    CommonModule,
    TreeModule,
    FormsModule,
    CheckboxModule,
    PanelModule,
    SliderModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    AutoCompleteModule,
    CalendarModule,
    ButtonModule,
    LensCoreModule,
  ],
  exports: [
    CriteriaCatalogueComponent
  ]
})
export class CriteriaCatalogueModule { }
