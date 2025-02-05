import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';
//Import Necesarios
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
//
import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from 'src/app/Interfaces/producto';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-producto',
    templateUrl: './producto.component.html',
    styleUrls: ['./producto.component.css'],
    standalone: false
})
//implementar Oninit,AfterViewInit
export class ProductoComponent implements OnInit,AfterViewInit {
  //Variables Nesarias
  columnasTabla:string[]=['Imagen','Nombre','Categoria','Stock','Precio','Estado','Acciones'];
  dataInicio:Producto[]=[];
  dataListaProductos= new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator)paginacionTabla!:MatPaginator;

  //Injectar Dependencias
  constructor(
    private dialog:MatDialog,
    private _productoService:ProductoService,
    private _utilidadService: UtilidadService
  ) {}

  obtenerProductos(){
    this._productoService.ListaProductos().subscribe({
      next:(data) => {
        if(data.status)
         this.dataListaProductos.data=data.value;
        else
         this._utilidadService.mostrarAlerta("No se Encontraron Datos");
      },
      error:(e)=>{}
    })
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator=this.paginacionTabla;
  }

  apilcarFiltrosTabla(event:Event){
    const filterValue=(event.target as HTMLInputElement).value;
    this.dataListaProductos.filter=filterValue.trim().toLowerCase();
  }

  nuevoProducto(){
    this.dialog.open(ModalProductoComponent,{
      disableClose:true
    }).afterClosed().subscribe(resultado => {
      if(resultado == "true")this.obtenerProductos()
    });
  }

  editarProducto(producto:Producto){
    this.dialog.open(ModalProductoComponent,{
      disableClose:true,
      data:producto
    }).afterClosed().subscribe(resultado => {
      if(resultado == "true")this.obtenerProductos()
    });
  }

  //color celda stock
  getStock(stock: number): string {
    if (stock <= 10) {
      return 'rojo';
    } else if (stock > 10 && stock <= 20) {
      return 'gris';
    } else {
      return 'verde';
    }
  }


  eliminarProducto(producto:Producto){
    Swal.fire({
      title:"Desea Eliminar El Producto?",
      text:producto.name,
      icon:"warning",
      confirmButtonColor:"#3085d6",
      confirmButtonText:"si , Eliminar",
      showCancelButton:true,
      cancelButtonColor:"#d33",
      cancelButtonText:"No, Volver"
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._productoService.EliminarProducto(producto.id).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadService.mostrarAlerta("Producto Eliminado");
              this.obtenerProductos();
            }else{
              this._utilidadService.mostrarAlerta("El Producto no pudo ser eliminado")
            }
          },
          error:(e)=>{}
        })
      }

    })
  }


}


