import {Routes} from '@angular/router';

const signUpRoute: string = 'sign-up';
const signInRoute: string = 'sign-in';

export const routes: Routes = [
  {
    path: '**',
    redirectTo: signInRoute,
    pathMatch: 'full'
  },
  {
    path: signUpRoute, loadComponent: () => import('./features/session/sign-up/sign-up.component').then(m => m.SignUpComponent)
  },
  {
    path: signInRoute, loadComponent: ()=> import('./features/session/sign-in/sign-in.component').then(m => m.SignInComponent)
  }
];
