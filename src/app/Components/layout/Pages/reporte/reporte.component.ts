import { Component, OnInit,AfterViewInit,ViewChild } from '@angular/core';
//
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
//
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
//Libreria para exportar a excel
import * as XLSX from "xlsx";
//Interfaces
import { Reporte } from 'src/app/Interfaces/reporte';
//Services
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

//Para formaear la fecha
export const MY_DATA_FORMATS={
  parse:{
    dateInput:"DD/MM/YYYY"
  },
  display:{
    dateInput:"DD/MM/YYYY",
    monthYearLabel:"MMMM YYYY"
  }
}


@Component({
    selector: 'app-reporte',
    templateUrl: './reporte.component.html',
    styleUrls: ['./reporte.component.css'],
    providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }],
    standalone: false
})
export class ReporteComponent implements OnInit {

  formularioFiltro:FormGroup;
  listaVentaReporte:Reporte[]=[];
  columnasTabla:string[]=["FechaRegistro","NumeroVenta","TipoPago","Total","Producto","Cantidad","Precio","TotalProducto"];
  dataVentaReporte=new MatTableDataSource(this.listaVentaReporte);

  //Paginacion
  @ViewChild(MatPaginator)paginacionTabla!:MatPaginator;

  //Establecer Injecciones Constructor
  constructor(
    private fb:FormBuilder,
    private _ventaServicio:VentaService,
    private _utilidadServicio:UtilidadService
  ) {

    //Establecer Campos del Formulario
    this.formularioFiltro=this.fb.group({
      fechaInicio:["",Validators.required],
      fechaFin:["",Validators.required]
    })

  }

  ngOnInit(): void {}

  //Metodo para la Paginacion
  ngAfterViewInit():void{
    this.dataVentaReporte.paginator=this.paginacionTabla;
  }

  buscarVentas(){
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('YYYY-MM-DD');
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format('YYYY-MM-DD');

   if(_fechaInicio === "Invalid date" || _fechaFin === "Invalid date"){
    this._utilidadServicio.mostrarAlerta("Debe Ingresar Ambas Fechas");
    return;
   }
  this._ventaServicio.Reporte(
    _fechaInicio,
    _fechaFin
  ).subscribe({
    next:(data)=>{
      if(data.status){
        this.listaVentaReporte=data.value;
        this.dataVentaReporte.data=data.value;
      }
      else{
        this.listaVentaReporte=[];
        this.dataVentaReporte.data=[];
        this._utilidadServicio.mostrarAlerta("No se Encontraron Datos");
      }
    },
    error:(e)=>{
        console.error('Error al obtener el reporte de ventas:', e);
    }
  })


  }


  //Funcion Para Exportar a excel

  exportarExcel() {
    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(this.listaVentaReporte);

      XLSX.utils.book_append_sheet(wb, ws, "Reporte");

      XLSX.writeFile(wb, "Reporte de Ventas.xlsx");
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
    }
  }




}
