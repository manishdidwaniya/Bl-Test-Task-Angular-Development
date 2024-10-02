import {Routes} from '@angular/router';

const signUpRoute: string = 'sign-up';

export const routes: Routes = [
  {path: signUpRoute, loadComponent: () => import('./features/session/sign-up/sign-up.component').then(m => m.SignUpComponent)},
  {
    path: '**',
    redirectTo: ''
  }
];
