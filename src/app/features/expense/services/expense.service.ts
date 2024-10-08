import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {expensesApiUrl} from "../../../shared/configurations/routes-config";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  newExpenseDetails = new Subject();
  newExpenseDetails$ = this.newExpenseDetails.asObservable();
  allExpenseDetails = new Subject();
  allExpenseDetails$ = this.allExpenseDetails.asObservable();

  constructor( private http: HttpClient) { }

  sendExpenseDetailsToServer(expenseDetails: any) {
    if (expenseDetails) {
      this.http.post(expensesApiUrl, expenseDetails).subscribe(value => {
        this.newExpenseDetails.next(value);
      })
    }
  }

  getAllExpenseDetails() {
    this.http.get(expensesApiUrl).subscribe(value => {
      if (value) {
        this.allExpenseDetails.next(value);
      }
    });
  }

}
