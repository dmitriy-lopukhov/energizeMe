import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil, debounceTime, filter } from 'rxjs/operators';
import { IChagingStation, IConsumption } from '../core/types/charging-station.type';
import { ChargingStationsService } from '../core/services/charging-stations.service';
import { Chart } from 'chart.js';
import { getPriceColor } from '../core/utils/utils';

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.page.html',
  styleUrls: ['./station-details.page.scss'],
})
export class StationDetailsPage implements OnDestroy {
  destroy$ = new Subject();
  @ViewChild('lineChart', { static: true }) lineChart;
  station: IChagingStation;
  lines: any;

  constructor(private route: ActivatedRoute,
    private chargingStationsService: ChargingStationsService) {


    this.chargingStationsService.chargingStations$.pipe(
      map(data => this.route.snapshot.params.id && data
        ? data.find(i => i.ID === +this.route.snapshot.params.id)
        : null
      ),
      takeUntil(this.destroy$),
    ).subscribe(
      data => {
        if (!data) {
          this.chargingStationsService.getChargingStations();
        } else {
          this.station = data;
          this.chargingStationsService.getConsumption(this.station.ID);
        }
      }
    );

    this.chargingStationsService.consumption$
      .pipe(
        debounceTime(300),
        filter(val => !!val),
        takeUntil(this.destroy$)
      )
      .subscribe(
        data => {
          this.createAreaChart(data);
        }
      );

  }

  ionViewDidEnter() {
    // this.createAreaChart();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  createAreaChart(data: IConsumption) {
    // const labels: string[] = [];
    // for (let i = 0; i < 23; i++) {
    //   const hour = i >= 9 ? i : '0' + i;
    //   labels.push(`${hour}:00`);
    // }

    // const prices: number[] = [];
    // for (let i = 0; i < 23; i++) {
    //   const price = Math.random() * 10;
    //   prices.push(price);
    // }

    this.lines = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'values',
          data: data.prices,
          backgroundColor: 'rgb(38, 194, 129)',
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  getPriceColor(price: number) {
    return getPriceColor(price);
  }

}
