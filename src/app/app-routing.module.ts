import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegistroComponent } from './Components/layout/Pages/registro/registro.component';

//configurar ruteo de paginas
const routes: Routes = [
  {path:"",component:LoginComponent,pathMatch:"full"},
  {path:'login',component:LoginComponent,pathMatch:"full"},
  //Para Acceder a las demas paginas
  {path:'pages',loadChildren:() => import("./Components/layout/layout.module").then(m => m.LayoutModule)},
  //Si no se escribre correctamente una pagina
  { path: 'registro', component: RegistroComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
