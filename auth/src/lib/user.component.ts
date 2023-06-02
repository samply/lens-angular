import {Component} from '@angular/core';
import {MenuItem} from "primeng/api";
import {UserService} from "./user.service";

@Component({
  selector: 'lens-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  userName: string = "";
  items: MenuItem[] = [
    {
      label: 'Sign In',
      icon: 'pi pi-sign-in',
      command: () => {
        this.userService.login()
      }
    }
  ];

  constructor(
    private userService: UserService
  ) {
    this.userService.isAuthenticated$.subscribe(
      () => {
        if (this.userService.isAuthenticated()){
          this.items = [
            {
              label: 'Sign Out',
              icon: 'pi pi-sign-out',
              command: () => {
                this.userService.logout()
              }
            }
          ]
          this.userName = this.userService.getUserClaim("name");
        } else {
          this.items = [
            {
              label: 'Sign In',
              icon: 'pi pi-sign-in',
              command: () => {
                this.userService.login()
              }
            }
          ]
        }
      }
    )
  }
}
