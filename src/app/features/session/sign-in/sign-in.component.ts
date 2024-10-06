import {Component, OnDestroy, OnInit} from '@angular/core';
import {TextBoxAllModule} from "@syncfusion/ej2-angular-inputs";
import {NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ButtonAllModule} from "@syncfusion/ej2-angular-buttons";
import {SessionService} from "../session.service";
import {AuthService} from "../../../shared/auth/auth.service";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    TextBoxAllModule,
    NgIf,
    ReactiveFormsModule,
    ButtonAllModule,
    RouterLink
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit, OnDestroy{
  public loginForm!: FormGroup;

  constructor(public fb: FormBuilder, private sessionService: SessionService,
              private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.buildUserLoginForm();
  }

  buildUserLoginForm() {
    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  ngOnDestroy() {
  }

  onSignInButtonClick() {
    if (this.loginForm && this.loginForm.value && this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((loginSuccess: Boolean) => {
        if (loginSuccess) {
          this.router.navigate(['dashboard']);
        } else {
          // TODO Error
        }
      })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
