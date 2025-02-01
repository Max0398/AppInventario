import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { ClientesComponent } from './Pages/clientes/clientes.component';
import { ProductosCardComponent } from './Pages/productos-card/productos-card.component';

//Configurar Ruteo
const routes: Routes = [
  {
    path:"",
    component:LayoutComponent,
    //Ruteo para Paginas Hijas que se cargue el componente
    children:[
      {path:'dashboard',component:DashBoardComponent},
      {path:'usuarios',component:UsuarioComponent},
      {path:'productos',component:ProductoComponent},
      {path:'venta',component:VentaComponent},
      {path:'historial_venta',component:HistorialVentaComponent},
      {path:'reportes',component:ReporteComponent},
      {path:'clientes',component:ClientesComponent},
      {path:'Tienda',component:ProductosCardComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
