import { Component} from '@angular/core';
//librerias para graficos
import { Chart, registerables } from 'chart.js';
//Servicios
import { DashBoardService } from 'src/app/Services/dash-board.service';
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
Chart.register(...registerables);


@Component({
    selector: 'app-dash-board',
    templateUrl: './dash-board.component.html',
    styleUrls: ['./dash-board.component.css'],
    standalone: false
})
export class DashBoardComponent {
 cols:number=3;
  totalIngresos:string='0';
  totalVentas:string='0';
  totalProductos:string='0';

  constructor(private _dashboardServicio:DashBoardService,private breakpointObserver: BreakpointObserver) {
  }

  mostrarGrafico(labelGrafico:any[],dataGrafico:any[]){
    const chartBarras= new Chart('chartBarras',{
      type:'bar',
      data:{
        labels:labelGrafico,
        datasets: [{
          label: 'Número de Ventas',
          data: dataGrafico,
          //Colores de Relleno
          backgroundColor: [
            'rgba(75, 192, 192,1)', // Verde
            'rgba(255, 99, 132,1)', // Rojo
            'rgba(54, 162, 235,1)', // Azul
            'rgba(255, 206, 86, 1', // Amarillo
            'rgba(153, 102, 255,1)' // Morado
          ],
          //Color del borde
          borderColor: [
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 1,
          barThickness:40 //Ancho de las barras
        }]
      },
      options:{
        maintainAspectRatio:false,
        responsive:true,
        scales:{
          y:{
            beginAtZero:true,
            ticks: {
              stepSize: 1, // Mostrar números de 1 en 1
              precision: 0 // Evitar decimales
            }
          }
        },
        plugins: {
          legend:{
            display: true
          }
        },

      }
    })
  }

  ngOnInit():void{

    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      if (result.matches) {
        this.cols = 1; // Cambia a una columna en dispositivos móviles
      } else {
        this.cols = 3; // Manténdra 3 columnas en pantallas más grandes
      }
    });

    this._dashboardServicio.Resumen().subscribe({
      next:(data)=>{
        if(data.status){
          this.totalIngresos=data.value.totalIngresos;
          this.totalVentas=data.value.totalVentas
          this.totalProductos=data.value.totalProductos;
          //obtener los datos
          const arrayData:any[]=data.value.ventasSemanaActual;
          //Separa los labels y los datos
          const labelTemp=arrayData.map((value)=>value.fecha);
          const dataTemp=arrayData.map((value)=>value.total);

          //para mostrar los graficos

          this.mostrarGrafico(labelTemp,dataTemp);
        }
      },
      error:(e)=>{}
    })
  }

}
