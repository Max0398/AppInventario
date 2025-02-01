import { Injectable } from '@angular/core';
//Utilizar los import
import{ HttpClient } from "@angular/common/http";
import{Observable} from "rxjs";
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../Interfaces/response-api';
import { Producto } from '../Interfaces/producto';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private urlApi:string =environment.endpoint;

  constructor(private http:HttpClient) { }

  ListaProductos():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}products`)
  }

  GuardarProducto(request:Producto):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}products/store`,request)
  }

  EditarProducto(request:Producto,id:number):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}products/${id}`,request)
  }

  EliminarProducto(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}products/${id}`)
  }

}
