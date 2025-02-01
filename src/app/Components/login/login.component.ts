import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from 'src/app/Interfaces/login';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {
  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  goToRegister() {
    this.router.navigate(['/registro']);
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioLogin = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }
  ngOnInit(): void {

  }

  iniciarSesion() {
    this.mostrarLoading = true;

    const request: Login = {
      email: this.formularioLogin.value.email,
      password: this.formularioLogin.value.password
    };

    this._usuarioService.IniciarSesion(request).subscribe({
      next: (data) => {
        if (data.status) {
          this._utilidadService.guardarSesionUsuario(data.value);
          this.router.navigate(["pages"]);
        } else {
          this._utilidadService.mostrarAlerta("No se Encontraron Coincidencias");
        }
      },
      error: (error) => {

        this._utilidadService.mostrarError( "Error Inesperado!");
      },
      complete: () => {
        this.mostrarLoading = false;
      }
    });
  }

}
