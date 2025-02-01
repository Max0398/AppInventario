//Importar Recurso Inject
import { Component,OnInit,Inject } from '@angular/core';
//Importaciones necesarias
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';
//
import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
    selector: 'app-modal-usuario',
    templateUrl: './modal-usuario.component.html',
    styleUrls: ['./modal-usuario.component.css'],
    standalone: false
})

export class ModalUsuarioComponent {

  //Variables necesarias
  formularioUsuario:FormGroup;
  ocultarPassword: boolean=true;
  tituloAccion:string="Agregar";
  botonAccion:string="Guardar";
  listaRoles:Rol[]=[];

  //Injectar Dependencias
  constructor(
    private modalActual:MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA)public datosUsuario:Usuario,
    private fb:FormBuilder,
    private _rolService:RolService,
    private _usuarioService:UsuarioService,
    private _utilidadService:UtilidadService
  ) {
    //Declarar campos del formulario
    this.formularioUsuario = this.fb.group({
      name:["",Validators.required],
      email:["",Validators.required],
      rol_id:["",Validators.required],
      password:["",Validators.required],
      active:["1",Validators.required]
    });

    if(this.datosUsuario!=null){
      this.tituloAccion="Editar";
      this.botonAccion="Actualizar";
    }

    //Para Mostrar Todos los roles en los desplegables
    this._rolService.ListaRoles().subscribe({
      next:(data)=> {
        if(data.status)this.listaRoles=data.value;
      },
      error:(e) =>{}
    });

  }
  ngOnInit():void{
    if(this.datosUsuario!=null){
      this.formularioUsuario.patchValue({
          name:this.datosUsuario.name,
          email:this.datosUsuario.email,
          rol_id:this.datosUsuario.rol_id,
          password:this.datosUsuario.password,
          active:this.datosUsuario.active.toString()
      })
      console.log(this.datosUsuario.password,this.datosUsuario.rol_id)
    }
  }

  guardarEditarUsuario(){
    const _usuario:Usuario={
      id:this.datosUsuario == null ? 0:this.datosUsuario.id,
      name: this.formularioUsuario.value.name,
      email: this.formularioUsuario.value.email,
      rol_id: this.formularioUsuario.value.rol_id,
      rolDescripcion:"",
      password: this.formularioUsuario.value.password,
      active: parseInt(this.formularioUsuario.value.active)
    }

    if(this.datosUsuario == null){
      this._usuarioService.Guardar(_usuario).subscribe({
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
      this._usuarioService.Editar(_usuario).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadService.mostrarExito("El Usuario Fue Editado.")
            this.modalActual.close("true")
          }else{
            this._utilidadService.mostrarAlerta("No se Pudo Editar el Usuario")
          }
        },
        error:(e)=>{}
      })
    }

  }

}
