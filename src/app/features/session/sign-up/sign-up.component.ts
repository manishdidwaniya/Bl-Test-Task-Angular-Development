import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TextBoxAllModule} from "@syncfusion/ej2-angular-inputs";
import {ButtonAllModule} from "@syncfusion/ej2-angular-buttons";
import {NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {SessionService} from "../session.service";
import {Subscription} from "rxjs";
import {Session} from "../model/session";
import {NotificationsService} from "../../../shared/common/services/notifications.service";


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextBoxAllModule,
    ButtonAllModule,
    NgIf
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})

export class SignUpComponent implements OnInit, OnDestroy {
  public signUpForm!: FormGroup;
  public userSignUp$: Subscription = new Subscription();
  constructor(private http: HttpClient, private sessionService: SessionService,
              private formBuilder: FormBuilder, private notificationsService: NotificationsService) {
  }


  ngOnInit() {
    this.createSignUpForm();
    this.userSignUp$ = this.sessionService.userSignUp$.subscribe(response => {
      if (response) {
        this.notificationsService.displaySuccessMessageOnToast('User has been created successfully.');
        //TODO: To be put code after successful creating user
      }
    })
  }

  createSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  onSubmit() {
    if (this.signUpForm && this.signUpForm.value && this.signUpForm.valid) {
      const newUser: Session = this.signUpForm.value;
      this.sessionService.onUserSignUp(newUser);
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    if (this.userSignUp$) {
      this.userSignUp$.unsubscribe();
    }
  }
}
