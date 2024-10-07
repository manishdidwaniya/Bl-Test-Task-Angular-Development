import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ButtonAllModule} from "@syncfusion/ej2-angular-buttons";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonAllModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'BI-SPLITWISE-TASK';
  loggedInUserName: any;
  constructor() {
    const loggedInUserDetails: any = localStorage.getItem('currentUser');
    if (loggedInUserDetails) {
      const details = JSON.parse(loggedInUserDetails);
      this.loggedInUserName = details.username;
    }
  }

}
