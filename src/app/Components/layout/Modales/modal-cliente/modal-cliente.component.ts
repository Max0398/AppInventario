import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Customer } from 'src/app/Interfaces/customer';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ClienteService } from 'src/app/Services/customer.service';

@Component({
    selector: 'app-modal-cliente',
    templateUrl: './modal-cliente.component.html',
    styleUrls: ['./modal-cliente.component.css'],
    standalone: false
})
export class ModalClienteComponent {
  formularioCliente: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';

  constructor(
    private modalActual: MatDialogRef<ModalClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCliente: Customer,
    private fb: FormBuilder,
    private _clienteService: ClienteService,
    private _utilidadService: UtilidadService
  ) {
    //declarar campos del formulario
    this.formularioCliente = this.fb.group({
      name:["",Validators.required],
      last_name:["",Validators.required],
      email:["",Validators.required],
      phone:["",Validators.required],
      address:["",Validators.required],
      active:["1",Validators.required]
    })

    if(datosCliente!=null){
      this.tituloAccion="Editar";
      this.botonAccion="Actualizar"
    }
  }

  ngOnInit():void{
    if(this.datosCliente!=null){
      this.formularioCliente.patchValue({
        name:this.datosCliente.name,
        last_name:this.datosCliente.last_name,
        email:this.datosCliente.email,
        phone:this.datosCliente.phone,
        address:this.datosCliente.address,
        active:this.datosCliente.active.toString()
      })
    }
  }

  guardarEditarCliente(){
    const _cliente:Customer={
      id:this.datosCliente==null ? 0:this.datosCliente.id,
      name:this.formularioCliente.value.name,
      last_name:this.formularioCliente.value.last_name,
      email:this.formularioCliente.value.email,
      phone:this.formularioCliente.value.phone,
      address:this.formularioCliente.value.address,
      active:parseInt(this.formularioCliente.value.active)
    }

    if(this.datosCliente == null){
      this._clienteService.GuardarCliente(_cliente).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadService.mostrarAlerta("El Usuario Fue Registrado.")
            this.modalActual.close("true")
          }else{
            this._utilidadService.mostrarAlerta("No se Pudo Registrar el Usuario")
          }
        },
        error:(e)=>{}
      })
    }
    else{
      this._clienteService.EditarCliente(_cliente,_cliente.id).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadService.mostrarAlerta("El Usuario Fue Editado.")
            this.modalActual.close("true")
          }else{
            this._utilidadService.mostrarAlerta("No se Pudo Editar el Usuario")
          }
        },
        error:(e)=>{}
      })
    }

    console.log(_cliente)

  }

}
