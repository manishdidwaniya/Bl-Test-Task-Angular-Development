import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {usersApiUrl} from "../configurations/routes-config";
import {map, Observable} from "rxjs";
import {Session} from "../../features/session/model/session";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;
  loggedInUser: Session[] = [];
  constructor(private http: HttpClient) { }

  /**
   * Logs in a user by verifying credentials against a mock user database.
   *
   * @param credentials - Object containing username and password.
   * @returns Observable<boolean> - Emits 'true' if login is successful, otherwise 'false'.
   *
   * - Sends a GET request to the `usersUrl` to fetch all user details.
   * - Finds a matching user based on the provided username and password.
   * - On successful login:
   *    - Sets `isLoggedIn` to true.
   *    - Stores the logged-in user details in `localStorage` as 'currentUser'.
   * - Emits 'false' if no matching user is found.
   */
  login(credentials: Session): Observable<boolean> {
    return this.http.get(usersApiUrl).pipe(
      map((userDetailsDb: any) => {
        const user = userDetailsDb.find((u: any) => u.username === credentials.username && u.password === credentials.password);
        if (user) {
          this.isLoggedIn = true;
          this.loggedInUser = user;
          localStorage.setItem('currentUser', JSON.stringify(user)); // Store user data
          return true;
        }
        return false;
      })
    );
  }

  // Function to check if user is authenticated
  isAuthenticated(): boolean {
    return this.isLoggedIn || localStorage.getItem('currentUser') != null;
  }
}
