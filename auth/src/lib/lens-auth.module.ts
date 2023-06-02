import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { SplitButtonModule } from 'primeng/splitbutton';



@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    SplitButtonModule
  ],
  exports: [
  ]
})
export class LensAuthModule { }
