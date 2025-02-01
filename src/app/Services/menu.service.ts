import { Injectable } from '@angular/core';
//Utilizar los import
import{ HttpClient } from "@angular/common/http";
import{Observable} from "rxjs";
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../Interfaces/response-api';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
private urlApi:string=environment.endpoint;

  constructor(private http:HttpClient) { }
  ListaMenuUsuario(idUsuario: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}menu/${idUsuario}`);

  };


}
