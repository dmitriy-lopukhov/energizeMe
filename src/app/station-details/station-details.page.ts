import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IChagingStation } from '../core/types/charging-station.type';
import { ChargingStationsService } from '../core/services/charging-stations.service';
import { Chart } from 'chart.js';

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

  constructor(private route: ActivatedRoute, private chargingStationsService: ChargingStationsService) {
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
        }
      }
    );
  }

  ionViewDidEnter() {
    this.createAreaChart();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  createAreaChart() {
    this.lines = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
        datasets: [{
          label: 'values',
          data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
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

}
