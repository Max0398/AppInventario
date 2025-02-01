import { Injectable } from '@angular/core';
//Utilizar los import
import{ HttpClient } from "@angular/common/http";
import{Observable} from "rxjs";
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../Interfaces/response-api';
import { Venta } from '../Interfaces/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private urlApi:string= environment.endpoint;

  constructor(private http:HttpClient) { }

  RegistrarVenta(request:Venta):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}orders`,request)
  }

 // Historial(buscarPor:string,numeroVenta:string,fechaInicio:string,fechaFin:string):Observable<ResponseApi>{
  //  return this.http.get<ResponseApi>(`${this.urlApi}Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
 // }
 getHistorialVentas():Observable<ResponseApi>{
  return this.http.get<ResponseApi>(`${this.urlApi}orders`)
}
  Reporte(fechaInicio:string,fechaFin:string):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
  }


}
