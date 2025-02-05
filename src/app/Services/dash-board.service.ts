import { Injectable } from '@angular/core';
import{ HttpClient } from "@angular/common/http";
import{Observable} from "rxjs";
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {
  private urlApi:string=environment.endpoint+"dashboard";
  constructor(private http:HttpClient) { }

  Resumen():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}`)
  }

}
