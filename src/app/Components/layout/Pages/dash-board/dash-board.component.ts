import { Component, OnInit } from '@angular/core';
//librerias para graficos
import { Chart, registerables } from 'chart.js';
//Servicios
import { DashBoardService } from 'src/app/Services/dash-board.service';
Chart.register(...registerables);


@Component({
    selector: 'app-dash-board',
    templateUrl: './dash-board.component.html',
    styleUrls: ['./dash-board.component.css'],
    standalone: false
})
export class DashBoardComponent {

  totalIngresos:string='0';
  totalVentas:string='0';
  totalProductos:string='0';

  constructor(private _dashboardServicio:DashBoardService) {
  }

  mostrarGrafico(labelGrafico:any[],dataGrafico:any[]){
    const chartBarras= new Chart('chartBarras',{
      type:'bar',
      data:{
        labels:labelGrafico,
        datasets:[{
          label:'# de Ventas',
          data:dataGrafico,
          backgroundColor:['rgba(54,162,235,0.2)'],
          borderColor:['rgba(54,162,235,1)'],
          borderWidth:1
        }]
      },
      options:{
        maintainAspectRatio:false,
        responsive:true,
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    })
  }

  ngOnInit():void{

    this._dashboardServicio.Resumen().subscribe({
      next:(data)=>{
        if(data.status){
          this.totalIngresos=data.value.totalIngresos;
          this.totalVentas=data.value.totalVentas
          this.totalProductos=data.value.totalProductos;
          //obtener los datos
          const arrayData:any[]=data.value.ventasUltimaSemana;
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
