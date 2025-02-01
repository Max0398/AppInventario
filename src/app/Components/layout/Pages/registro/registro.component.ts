import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar ReactiveFormsModule
import { MatCardModule } from '@angular/material/card'; // Importar MatCardModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Importar MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Importar MatInputModule
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule
import { MatIconModule } from '@angular/material/icon'; // Importar MatIconModule
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Importar MatProgressBarModule
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { Registro } from 'src/app/Interfaces/registro';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [
    CommonModule, // Para *ngIf y otras directivas
    ReactiveFormsModule, // Para formularios reactivos
    MatCardModule, // Para <mat-card>
    MatFormFieldModule, // Para <mat-form-field>
    MatInputModule, // Para <input matInput>
    MatButtonModule, // Para <button mat-button>
    MatIconModule, // Para <mat-icon>
    MatProgressBarModule // Para <mat-progress-bar>
  ]
})

export class RegistroComponent implements OnInit {
  formularioRegistro: FormGroup;
  mostrarLoading: boolean = false;
  ocultarPassword:boolean=false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioRegistro = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],

    });
  }

  ngOnInit(): void {}

  registrarUsuario() {
    this.mostrarLoading = true;

    const request: Registro = {
      name: this.formularioRegistro.value.name,
      email: this.formularioRegistro.value.email,
      password: this.formularioRegistro.value.password,
      rol_id: 2,
      active: 1
    };

    console.log(request)

    this._usuarioService.Registro(request).subscribe({
      next: (data) => {
        if (data.status) {
          this._utilidadService.mostrarAlerta("Usuario registrado correctamente");
          this.router.navigate(["login"]); // Redirigir al login después del registro
        } else {
          this._utilidadService.mostrarAlerta("No se pudo registrar el usuario");
        }
      },
      error: (error) => {
        this._utilidadService.mostrarError( "Error inesperado!");
      },
      complete: () => {
        this.mostrarLoading = false;
      }
    });
  }
}
