import { Injectable } from '@angular/core';
//Utilizar los import
import{ HttpClient } from "@angular/common/http";
import{Observable} from "rxjs";
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../Interfaces/response-api';
import { Producto } from '../Interfaces/producto';
import { Customer } from '../Interfaces/customer';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlApi:string =environment.endpoint;

  constructor(private http:HttpClient) { }

  ListaClientes():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}customers`)
  }

  GuardarCliente(request:Customer):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}customers`,request)
  }

  EditarCliente(request:Customer,id:number):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}customers/${id}`,request)
  }

  EliminarCliente(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}customers/${id}`)
  }

}
