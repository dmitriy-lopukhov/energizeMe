import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { stats } from '../core/constants/stats';
import { IStats } from '../core/types/charging-station.type';
import { reduce } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild('lineChart', { static: true }) lineChart;
  @ViewChild('hrzLineChart', { static: true }) hrzLineChart;
  @ViewChild('hrzLineChart2', { static: true }) hrzLineChart2;
  @ViewChild('hrzLineChart3', { static: true }) hrzLineChart3;

  lines: any;
  hrzLines: any;
  hrzLines2: any;
  hrzLines3: any;
  colorArray: any;
  constructor() { }

  ionViewDidEnter() {
    // this.createAreaChart();
    // this.createSimpleLineChart();
    this.createGroupLineChart();
    // this.createHrzLineChart3();
  }

  // createAreaChart() {
  //   this.lines = new Chart(this.lineChart.nativeElement, {
  //     type: 'line',
  //     data: {
  //       labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
  //       datasets: [{
  //         label: 'Viewers in millions',
  //         data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
  //         backgroundColor: 'rgb(38, 194, 129)',
  //         borderColor: 'rgb(38, 194, 129)',
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [{
  //           ticks: {
  //             beginAtZero: true
  //           }
  //         }]
  //       }
  //     }
  //   });
  // }

  // createSimpleLineChart() {
  //   this.hrzLines = new Chart(this.hrzLineChart.nativeElement, {
  //     type: 'line',
  //     data: {
  //       labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
  //       datasets: [{
  //         label: 'Viewers in millions',
  //         data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
  //         backgroundColor: 'rgba(0, 0, 0, 0)',
  //         borderColor: 'rgb(38, 194, 129)',
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [{
  //           ticks: {
  //             beginAtZero: true
  //           }
  //         }]
  //       }
  //     }
  //   });
  // }
  getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
  getRandomColor(): string {
    return `rgb(${this.getRandomNumber(10, 200)}, ${this.getRandomNumber(10, 200)}, ${this.getRandomNumber(10, 200)})`;
  }

  createGroupLineChart() {
    const labels: string[] = [];
    for (let i = 0; i < 23; i++) {
      const hour = i >= 9 ? i : '0' + i;
      labels.push(`${hour}:00`);
    }
    const data: IStats = stats
      .reduce((res, item) => {
        Object.keys(item).forEach(key => {
          if (!res[key]) {
            res[key] = [];
          }
          res[key].push(parseFloat(item[key]));
        });
        return res;
      }, {});

    this.hrzLines2 = new Chart(this.hrzLineChart2.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: Object.keys(data).map(key => {
          return {
            label: key,
            data: data[key],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: this.getRandomColor(),
            borderWidth: 1
          };
        })
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

  // createHrzLineChart3() {
  //   const ctx = this.hrzLineChart3.nativeElement;
  //   ctx.height = 400;
  //   this.hrzLines3 = new Chart(ctx, {
  //     type: 'line',
  //     data: {
  //       labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
  //       datasets: [{
  //         label: 'Online viewers in millions',
  //         data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
  //         backgroundColor: 'rgb(242, 38, 19)',
  //         borderColor: 'rgb(242, 38, 19)',
  //         borderWidth: 1
  //       },
  //       {
  //         label: 'Offline viewers in millions',
  //         data: [1.5, 2.8, 3, 4.9, 4.9, 5.5, 7, 12],
  //         backgroundColor: 'rgb(38, 194, 129)',
  //         borderColor: 'rgb(38, 194, 129)',
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [{
  //           ticks: {
  //             beginAtZero: true
  //           },
  //           stacked: true
  //         }]
  //       }
  //     }
  //   });
  // }
}
