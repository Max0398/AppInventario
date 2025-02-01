import { Component,OnInit,Inject } from '@angular/core';

//
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';


@Component({
    selector: 'app-modal-detalle-venta',
    templateUrl: './modal-detalle-venta.component.html',
    styleUrls: ['./modal-detalle-venta.component.css'],
    standalone: false
})
export class ModalDetalleVentaComponent implements OnInit {

  id:string="";
  total:string="";
  products:DetalleVenta[]=[];
  columnasTabla:string[]=["Producto","Cantidad","Precio","Total"];

  constructor(@Inject(MAT_DIALOG_DATA)public _venta:Venta){

    this.total=_venta.total.toString();
    this.products= _venta.products;
  }

  ngOnInit(): void {

  }

}
