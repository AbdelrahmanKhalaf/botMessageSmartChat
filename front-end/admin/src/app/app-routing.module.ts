import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "users", loadChildren: () => import('./users/users.module').then(m => m.UsersModule), },
  { path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), },
  { path: "all-bouqute", loadChildren: () => import('./bouqute/bouqute.module').then(m => m.BouquteModule), },
  { path: "all-socail", loadChildren: () => import('./socail/socail.module').then(m => m.SocailModule), },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
