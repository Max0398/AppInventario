import { Injectable } from '@angular/core';

//Utilizar los import
import{ HttpClient } from "@angular/common/http";
import{Observable} from "rxjs";
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../Interfaces/response-api';
import { Login } from '../Interfaces/login';
import { Usuario } from '../Interfaces/usuario';
import { Registro } from '../Interfaces/registro';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlApi:string =environment.endpoint+"user/";

  constructor(private http:HttpClient) { }

  IniciarSesion(request:Login):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}login`,request)
  }

  ListaUsuarios():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}listUsers`)
  }

  Guardar(request:Usuario):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}register`,request)
  }

  Editar(request:Usuario):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`,request)
  }
  Registro(request:Registro):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}register`,request)
  }
  Eliminar(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }


}
