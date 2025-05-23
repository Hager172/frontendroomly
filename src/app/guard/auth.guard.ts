import { inject, Inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if(token){
  return true;
  }
  else{
    router.navigateByUrl("login");
    return false;

  }
};
