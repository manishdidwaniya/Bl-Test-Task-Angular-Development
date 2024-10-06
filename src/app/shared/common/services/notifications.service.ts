import { Injectable } from '@angular/core';
import {ToastComponent, ToastUtility} from "@syncfusion/ej2-angular-notifications";
import {ToastTimeoutDuration} from "../../configurations/app-settings";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public toastComponentReference!: ToastComponent;
  constructor() { }

  displaySuccessMessageOnToast(successMessageToBeDisplayed: string) {
    if (successMessageToBeDisplayed !== undefined && successMessageToBeDisplayed !== null && successMessageToBeDisplayed !== '' &&
      ToastUtility !== undefined && ToastUtility !== null) {
      if (this.toastComponentReference !== undefined && this.toastComponentReference !== null) {
        this.toastComponentReference.hide('All')
      }
      this.toastComponentReference = ToastUtility.show({
        title: 'Success',
        content: successMessageToBeDisplayed,
        timeOut: ToastTimeoutDuration,
        position: {X: 'Center', Y: 'Bottom'},
        showCloseButton: true,
        cssClass: 'e-toast-success'
      }) as ToastComponent;
    }
  }
}
