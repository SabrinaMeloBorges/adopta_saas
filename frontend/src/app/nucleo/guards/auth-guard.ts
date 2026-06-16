import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../servicos/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (auth.autenticado()) return true;
  router.navigate(['/login'], { queryParams: { volta: state.url } });
  return false;
};
