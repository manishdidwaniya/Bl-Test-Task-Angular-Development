import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChartAllModule} from "@syncfusion/ej2-angular-charts";
import {ExpenseService} from "../expense/services/expense.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChartAllModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  expenseData: any = [];
  allExpenseDetails$ : Subscription = new Subscription();
  public primaryXAxis!: Object;
  public primaryYAxis!: Object;
  public marker!: Object;

  constructor(private expenseService: ExpenseService) {
  }

  ngOnInit() {
    this.primaryXAxis = {
      valueType: 'DateTime',
      labelFormat: 'MMM dd',
      title: 'Date',
    };
    this.primaryYAxis = {
      title: 'Amount ($)',
      minimum: 0,
      maximum: 1000,
      interval: 100,
    };
    this.marker = {
      dataLabel: {
        visible: true,
      },
    };
    this.allExpenseDetails$ = this.expenseService.allExpenseDetails$.subscribe((allExpenseDetails: any) => {
      if (allExpenseDetails) {
        this.expenseData = allExpenseDetails.map((expense: any) => ({
          date: new Date(expense.date),
          amount: expense.amount
        }));
      }
    });
    this.expenseService.getAllExpenseDetails();
  }

  ngOnDestroy() {
    if (this.allExpenseDetails$) {
      this.allExpenseDetails$.unsubscribe();
    }
  }

}
