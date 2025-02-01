import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Customer } from 'src/app/Interfaces/customer';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ClienteService } from 'src/app/Services/customer.service';
import Swal from 'sweetalert2';
import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { ModalClienteComponent } from '../../Modales/modal-cliente/modal-cliente.component';

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html',
    styleUrls: ['./clientes.component.css'],
    standalone: false
})
export class ClientesComponent {


  //implementar Oninit,AfterViewInit
  //Variables Nesarias
    columnasTabla:string[]=['Nombres','Apellidos','Correo','Telefono','Direccion','Estado','Acciones'];
    dataInicio:Customer[]=[];
    dataListaClientes= new MatTableDataSource(this.dataInicio);
    @ViewChild(MatPaginator)paginacionTabla!:MatPaginator;

  //Injectar Dependencias
    constructor(
      private dialog:MatDialog,
      private _clienteService:ClienteService,
      private _utilidadService: UtilidadService
    ) {}

    obtenerClientes(){
      this._clienteService.ListaClientes().subscribe({
        next:(data) => {
          if(data.status)
           this.dataListaClientes.data=data.value;
          else
           this._utilidadService.mostrarAlerta("No se Encontraron Datos");
        },
        error:(e)=>{}
      })
    }

    ngOnInit(): void {
      this.obtenerClientes();
    }

    ngAfterViewInit(): void {
      this.dataListaClientes.paginator=this.paginacionTabla;
    }

    apilcarFiltrosTabla(event:Event){
      const filterValue=(event.target as HTMLInputElement).value;
      this.dataListaClientes.filter=filterValue.trim().toLowerCase();
    }

    nuevoCliente(){
      this.dialog.open(ModalClienteComponent,{
        disableClose:true
      }).afterClosed().subscribe(resultado => {
        if(resultado == "true")this.obtenerClientes()
      });
    }

    editarCliente(cliente:Customer){
      this.dialog.open(ModalClienteComponent,{
        disableClose:true,
        data:cliente
      }).afterClosed().subscribe(resultado => {
        if(resultado == "true")this.obtenerClientes()
      });
    }

    eliminarCliente(customer:Customer){
      Swal.fire({
        title:"Desea Eliminar El Usuario?",
        text:customer.name,
        icon:"warning",
        confirmButtonColor:"#3085d6",
        confirmButtonText:"si , Eliminar",
        showCancelButton:true,
        cancelButtonColor:"#d33",
        cancelButtonText:"No, Volver"
      }).then((resultado)=>{
        if(resultado.isConfirmed){
          this._clienteService.EliminarCliente(customer.id).subscribe({
            next:(data)=>{
              if(data.status){
                this._utilidadService.mostrarAlerta("Cliente Eliminado");
                this.obtenerClientes();
              }else{
                this._utilidadService.mostrarAlerta("El Cliente no pudo ser eliminado")
              }
            },
            error:(e)=>{}
          })
        }

      })
    }



  }


