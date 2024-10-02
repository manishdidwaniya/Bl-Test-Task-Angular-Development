import { Injectable } from '@angular/core';
import {signUpApiUrl} from '../../shared/routes'
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public userSignUp = new Subject();
  public userSignUp$ = this.userSignUp.asObservable();
  constructor(private http: HttpClient) { }

  onUserSignUp(newUser: any) {
    this.http.post(signUpApiUrl, newUser).subscribe({
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
