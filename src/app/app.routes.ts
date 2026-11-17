/**
 * =====================================================================
 *  src/app/app.routes.ts · MAPA DE PANTALLAS (rutas)
 * ---------------------------------------------------------------------
 *  Cada objeto dice: "cuando la dirección sea X, muestra la página Y".
 *  loadComponent + import(): la página se descarga recién cuando se
 *  necesita (carga perezosa / lazy loading) → la app abre más rápido.
 * =====================================================================
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage),
  },
  {
    path: 'catalogo',         // Semana 02: componentes de interfaz y eventos
    loadComponent: () => import('./pages/catalogo/catalogo.page').then((m) => m.CatalogoPage),
  },
  {
    path: 'ciclo-vida',       // Semana 02: ciclo de vida de una pantalla y de la app
    loadComponent: () => import('./pages/ciclo-vida/ciclo-vida.page').then((m) => m.CicloVidaPage),
  },
  {
    path: '',                 // dirección vacía (al abrir la app)…
    redirectTo: 'inicio',     // …redirige a /inicio
    pathMatch: 'full',
  },
];
