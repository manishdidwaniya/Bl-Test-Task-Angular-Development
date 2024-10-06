import { Injectable } from '@angular/core';
import {usersApiUrl} from '../../shared/configurations/routes-config'
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public userSignUp = new Subject();
  public userSignUp$ = this.userSignUp.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Handles user sign-up by sending the new user data to the server.
   *
   * @param newUser - Object containing the new user's registration details.
   *
   * - Sends a POST request to the `usersUrl` with the new user's data.
   * - On successful response:
   *    - Emits the new user data via the `userSignUp` subject.
   * - On error:
   *    - Displays an alert with the error message.
   */
  onUserSignUp(newUser: any) {
    this.http.post(usersApiUrl, newUser).subscribe({
      next: (value) => {
        if (value) {
          this.userSignUp.next(value);
        }
      },
      error: (err) => {
        window.alert(err)
      }
    });
  }

}
