import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'primaria',
    loadComponent: () => import('./primaria/primaria.component').then((m) => m.PrimariaComponent),
  },
  {
    path: 'secundaria',
    loadComponent: () => import('./secundaria/secundaria.component').then((m) => m.SecundariaComponent),
  }
];
