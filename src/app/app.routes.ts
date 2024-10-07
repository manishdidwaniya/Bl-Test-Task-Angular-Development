import {Routes} from '@angular/router';
import {authGuard} from "./shared/auth/auth.guard";

const signUpRoute: string = 'sign-up';
const signInRoute: string = 'sign-in';
const dashboardRoute: string = 'dashboard';
const groupRoute: string = 'groups';
const expenseRoute: string = 'expenses';

export const routes: Routes = [
  {
    path: '',
    redirectTo: signInRoute,
    pathMatch: 'full'
  },
  {
    path: signUpRoute, loadComponent: () => import('./features/session/sign-up/sign-up.component').then(m => m.SignUpComponent)
  },
  {
    path: signInRoute, loadComponent: ()=> import('./features/session/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  { canActivate: [authGuard],
    path: dashboardRoute, loadComponent: ()=> import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    canActivate: [authGuard],
    path: groupRoute, loadComponent: ()=> import('./features/groups/management/list-group/list-group.component').then(m => m.ListGroupComponent)
  },
  {
    canActivate: [authGuard],
    path: expenseRoute, loadComponent: ()=> import('./features/expense/management/modify-expense/modify-expense.component').then(m => m.ModifyExpenseComponent)
  },
  {
    path: '**',
    pathMatch: 'full',
    loadComponent: () => import('./shared/common/error/error-404/error-404.component').then(m=> m.Error404Component)
  }
];
