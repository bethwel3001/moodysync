import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/canvas/canvas.component').then(m => m.CanvasComponent)
  }
];