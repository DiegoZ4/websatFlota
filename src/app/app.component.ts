import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpDataService } from './services/http-data.service';

import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';

// import * as gpsApi from '../assets/js/gpsApi.js';
// const yourModuleName = require('../assets/js/gpsApi.js');

// import * as gpsApi from 'gpsApi';

declare const gpsApi: any;
declare const connect: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  title = 'websatFlota';
  formaWp: FormGroup;


  vehicles:any[] = [];
  vehicleSelected = 'hola';

  lista = [
    {
      id: '10',
      nombre: 'Lionel Messi',
      descripcion: 'Jugador del PSG'
    },
    {
      id: '9',
      nombre: 'Julioan Alvares',
      descripcion: 'Jugador de River'
    },
    {
      id: '7',
      nombre: 'Mbappe',
      descripcion: 'Jugador del PSG'
    }
  ];

  seleccionado: any;

  currentMonthIdx: number = 0;
  lastMonthIdx: number = 0;

  monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  canShow = false;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: {
        display: true,
        maxWidth: 40,
        labels: {
          boxWidth: 40
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'> = {
    labels: [ 
      '1','2','3','4','5','6','7','8','9','10',
    ],
    datasets: [
      // { data: [ 65, 59, 80, 81, 56, 55, 40, 56, 55, 40 ], label: 'Marzo' },
      // { data: [ 28, 48, 40, 19, 86, 27, 90, 56, 55, 40 ], label: 'Abril' }
    ]
  };
  

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }


  constructor(
    private httpData: HttpDataService,
    private fb: FormBuilder,
  ) {

    this.formaWp = this.fb.group({
      apikey            : ['c4db80de426bfb6f779895354de17e1c'],
      username          : ['veneto'],
      password          : ['veneto33'],
      token             : []
    });

    // this.httpData.getToken(this.formaWp)
    //     .subscribe( (resp: any) => {
    //       console.log(resp);
    //     })

    
  }

  ngOnInit(){

    console.log( gpsApi )

    this.getToken();

    gpsApi.connect('veneto', 'veneto33', 'c4db80de426bfb6f779895354de17e1c').then( (res: any) => {
      console.log(res)
      const token = res.data;

      console.log('on connect');

      gpsApi.vehicleGetAll().then( (vehicles: any) => {
        console.log( 'Vehicles', vehicles );

        this.vehicles = vehicles.data;

        gpsApi.getAssetsLastReport().then( (res2: any) => {
          console.log( 'asds',res2 );
          
          this.seleccionado = this.vehicles.find(x=> x.idgps === res2.data[1].GpsIdentif)
  
          this.loadData( res2.data[1].GpsIdentif, res2.data[1].UnitId );
  
        });

      })

      
    })
  }

  calcVariacion(a:number,b:number) {
    if ( b && a !== 0 ) {
      return ((b-a)/a*100).toFixed(2);
    } else if ( a === 0) {
      return (b*100).toFixed(2)
    } else {
      return 0
    }    
  }

  onChange() {
    console.log(this.seleccionado);
    this.loadData(this.seleccionado.idgps, this.seleccionado.nombre)
  }

  loadData(equipo:number, nombre?:string){

    this.canShow = false;

    const today = new Date();
    const currentMonth = today.getMonth() < 10 ? '0'+(today.getMonth()+1) : today.getMonth()+1;
    const lastMonth = today.getMonth() < 10 ? '0'+(today.getMonth()) : today.getMonth();
    const currentMonthNumber = today.getMonth()+1;
    const lastMonthNumber = today.getMonth();

    const lastDayCurrentMont = new Date(2022, currentMonthNumber, 0).getDate();
    const lastDayLastMont = new Date(2022, lastMonthNumber, 0).getDate();

    this.currentMonthIdx = today.getMonth();
    this.lastMonthIdx = today.getMonth()-1;

    nombre ? this.vehicleSelected = nombre : null;
    // nombre ? this.seleccionado = nombre : null;

    this.barChartData.datasets = [];
    this.chart?.update();

    gpsApi.getHistory(equipo,'2022-'+lastMonth+'-01 00:00:00','2022-'+lastMonth+'-'+lastDayLastMont+' 00:00:00' ).then( (res3: any) => {
      console.log('History', res3);
      
      // res3.data.forEach( (r:any) => {
      //   console.log(r);
      // });
      let activacionEBSM = [];
      let activacionEBSM2 = [];
      let activacionEBSP = [];
      let activacionEBSP2 = [];
      let activacionEBSR = [];
      let activacionEBSR2 = [];
      let activacionEBSC = [];
      let activacionEBSC2 = [];
      let falloRuedaD = [];
      let falloRuedaI = [];

      for (const r of res3.data) {
        // console.log(r);
        // console.log(r.idevento);
        // console.log(JSON.parse(r.datos_extras))
        r.idevento == 1336 && activacionEBSM.push(r);
        r.idevento == 1337 && activacionEBSM2.push(r);
        r.idevento == 1338 && activacionEBSP.push(r);
        r.idevento == 1339 && activacionEBSP2.push(r);
        r.idevento == 1321 && activacionEBSR.push(r);
        r.idevento == 1322 && activacionEBSR2.push(r);
        r.idevento == 1323 && activacionEBSC.push(r);
        r.idevento == 1324 && activacionEBSC2.push(r);
        r.idevento == 1325 && falloRuedaD.push(r);
        r.idevento == 1326 && falloRuedaI.push(r);
      }

      console.log(activacionEBSM.length);
      console.log(activacionEBSM2.length);
      console.log(activacionEBSP.length);
      console.log(activacionEBSP2.length);
      console.log(activacionEBSR.length);
      console.log(activacionEBSR2.length);
      console.log(activacionEBSC.length);
      console.log(activacionEBSC2.length);
      console.log(falloRuedaD.length);
      console.log(falloRuedaI.length);

      const extras = JSON.parse(res3.data[0].datos_extras)
      console.log('History Extra', extras );

      const monthData = 
        { data: [
          activacionEBSM.length,
          activacionEBSM2.length,
          activacionEBSP.length,
          activacionEBSP2.length,
          activacionEBSR.length,
          activacionEBSR2.length,
          activacionEBSC.length,
          activacionEBSC2.length,
          falloRuedaD.length,
          falloRuedaI.length,
        ], label: this.monthNames[ this.lastMonthIdx ] 
      };

      this.barChartData.datasets[0] = monthData;

      this.chart?.update();

      // Traigo la siguiente DATA

      gpsApi.getHistory(equipo,'2022-'+currentMonth+'-01 00:00:00','2022-'+currentMonth+'-'+lastDayCurrentMont+' 00:00:00' ).then( (res3: any) => {
        console.log('History 2', res3);
        
        // res3.data.forEach( (r:any) => {
        //   console.log(r);
        // });
        let activacionEBSM = [];
        let activacionEBSM2 = [];
        let activacionEBSP = [];
        let activacionEBSP2 = [];
        let activacionEBSR = [];
        let activacionEBSR2 = [];
        let activacionEBSC = [];
        let activacionEBSC2 = [];
        let falloRuedaD = [];
        let falloRuedaI = [];
  
        for (const r of res3.data) {
          // console.log(r);
          // console.log(r.idevento);
          // console.log(JSON.parse(r.datos_extras))
          r.idevento == 1336 && activacionEBSM.push(r);
          r.idevento == 1337 && activacionEBSM2.push(r);
          r.idevento == 1338 && activacionEBSP.push(r);
          r.idevento == 1339 && activacionEBSP2.push(r);
          r.idevento == 1321 && activacionEBSR.push(r);
          r.idevento == 1322 && activacionEBSR2.push(r);
          r.idevento == 1323 && activacionEBSC.push(r);
          r.idevento == 1324 && activacionEBSC2.push(r);
          r.idevento == 1325 && falloRuedaD.push(r);
          r.idevento == 1326 && falloRuedaI.push(r);
        }
  
        console.log(activacionEBSM.length);
        console.log(activacionEBSM2.length);
        console.log(activacionEBSP.length);
        console.log(activacionEBSP2.length);
        console.log(activacionEBSR.length);
        console.log(activacionEBSR2.length);
        console.log(activacionEBSC.length);
        console.log(activacionEBSC2.length);
        console.log(falloRuedaD.length);
        console.log(falloRuedaI.length);
  
        const extras = JSON.parse(res3.data[0].datos_extras)
        console.log('History Extra', extras );
  
        const monthData = 
          { data: [
            activacionEBSM.length,
            activacionEBSM2.length,
            activacionEBSP.length,
            activacionEBSP2.length,
            activacionEBSR.length,
            activacionEBSR2.length,
            activacionEBSC.length,
            activacionEBSC2.length,
            falloRuedaD.length,
            falloRuedaI.length,
          ], label: this.monthNames[ this.currentMonthIdx ] 
        };
  
        this.barChartData.datasets[1] = monthData;
  
        this.chart?.update();

        this.canShow = true;
      })
    })

  }

  async getToken() {

    // gpsApi.connect('veneto', 'veneto33', 'c4db80de426bfb6f779895354de17e1c').then( (res: any) => {
    //   console.log(res)
    // })
    // const token = await gpsApi.connect('veneto', 'veneto33', 'c4db80de426bfb6f779895354de17e1c');
    // console.log( token );

    // setTimeout(() => {
    //   console.log( token );
    //   console.log( gpsApi.token)
    // }, 2000);

    // console.log( gpsApi.token)

    // console.log( await gpsApi.connect('veneto', 'veneto33', 'c4db80de426bfb6f779895354de17e1c') )
  }
}
