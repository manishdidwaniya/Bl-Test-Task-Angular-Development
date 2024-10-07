import {Component, OnDestroy, OnInit} from '@angular/core';
import {ButtonModule} from "@syncfusion/ej2-angular-buttons";
import {NgIf} from "@angular/common";
import {SessionService} from "../../../../features/session/session.service";
import {Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../../auth/auth.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit, OnDestroy{
  isUserAuthenticated: boolean = false;
  loggedInUserName: any;
  isUserAuthenticated$: Subscription = new Subscription();

  constructor(private sessionService: SessionService, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    const loggedInUserDetails: any = localStorage.getItem('currentUser');
    if (loggedInUserDetails) {
      this.isUserAuthenticated = true;
      const details = JSON.parse(loggedInUserDetails);
      this.loggedInUserName = details.username;
    }
    this.isUserAuthenticated$ = this.authService.isUserAuthenticated$.subscribe((isUserAuthenticated: boolean) => {
      this.isUserAuthenticated = isUserAuthenticated;
    })
  }

  ngOnDestroy() {
    if (this.isUserAuthenticated$) {
      this.isUserAuthenticated$.unsubscribe();
    }
  }

}
