import { Routes } from '@angular/router';
import { authGuard } from './nucleo/guards/auth-guard';
import { adminGuard } from './nucleo/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./paginas/home/home').then((m) => m.Home),
    title: 'Adopta — Encontre seu novo melhor amigo',
  },
  {
    path: 'pets',
    loadComponent: () => import('./paginas/pets-lista/pets-lista').then((m) => m.PetsLista),
    title: 'Pets disponíveis — Adopta',
  },
  {
    path: 'pets/:id',
    loadComponent: () => import('./paginas/pets-detalhe/pets-detalhe').then((m) => m.PetsDetalhe),
  },
  {
    path: 'favoritos',
    loadComponent: () => import('./paginas/favoritos/favoritos').then((m) => m.Favoritos),
    title: 'Seus favoritos — Adopta',
  },
  {
    path: 'adotados',
    loadComponent: () => import('./paginas/adotados/adotados').then((m) => m.Adotados),
    title: 'Histórias felizes — Adopta',
  },
  {
    path: 'sobre',
    loadComponent: () => import('./paginas/sobre/sobre').then((m) => m.Sobre),
    title: 'Sobre o Adopta',
  },
  {
    path: 'login',
    loadComponent: () => import('./paginas/login/login').then((m) => m.Login),
    title: 'Entrar — Adopta',
  },
  {
    path: 'registrar',
    loadComponent: () => import('./paginas/registrar/registrar').then((m) => m.Registrar),
    title: 'Criar conta — Adopta',
  },
  {
    path: 'minhas-solicitacoes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./paginas/minhas-solicitacoes/minhas-solicitacoes').then((m) => m.MinhasSolicitacoes),
    title: 'Minhas solicitações — Adopta',
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./admin/dashboard/dashboard').then((m) => m.Dashboard),
        title: 'Painel — Adopta',
      },
      {
        path: 'pets',
        loadComponent: () => import('./admin/pets-crud/pets-crud').then((m) => m.PetsCrud),
        title: 'Gerenciar pets — Adopta',
      },
      {
        path: 'pets/novo',
        loadComponent: () => import('./admin/pet-formulario/pet-formulario').then((m) => m.PetFormulario),
        title: 'Novo pet — Adopta',
      },
      {
        path: 'pets/:id/editar',
        loadComponent: () => import('./admin/pet-formulario/pet-formulario').then((m) => m.PetFormulario),
      },
      {
        path: 'solicitacoes',
        loadComponent: () => import('./admin/solicitacoes/solicitacoes').then((m) => m.Solicitacoes),
        title: 'Solicitações — Adopta',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
