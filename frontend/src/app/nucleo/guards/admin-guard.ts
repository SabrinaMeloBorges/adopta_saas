import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../servicos/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (auth.autenticado() && auth.ehAdmin()) return true;
  if (!auth.autenticado()) {
    router.navigate(['/login'], { queryParams: { volta: state.url } });
  } else {
    router.navigate(['/']);
  }
  return false;
};
