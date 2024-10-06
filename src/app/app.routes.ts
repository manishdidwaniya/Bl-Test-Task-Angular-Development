import {Routes} from '@angular/router';
import {authGuard} from "./shared/auth/auth.guard";

const signUpRoute: string = 'sign-up';
const signInRoute: string = 'sign-in';
const dashboardRoute: string = 'dashboard';
const groupRoute: string = 'groups';

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
    path: groupRoute, loadComponent: ()=> import('./features/groups/management/list-group/list-group.component').then(m => m.ListGroupComponent)
  }
];
