import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { IChagingStation, IPrices, IConsumptionResponse, IConsumption } from '../types/charging-station.type';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { map, mergeMap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ChargingStationsService {
  private readonly apiHost = 'https://energizehackathonka2019.herokuapp.com';

  private chargingStations = new BehaviorSubject<IChagingStation[]>(null);
  readonly chargingStations$ = this.chargingStations.asObservable();

  private consumption = new BehaviorSubject<IConsumption>(null);
  readonly consumption$ = this.consumption.asObservable();

  constructor(private http: HttpClient, private geolocation: Geolocation) { }


  getChargingStations(): void {
    this.getCurrentPosition().then((resp) => {
      const options = {
        output: 'json',
        countrycode: 'DE',
        latitude: resp.coords.latitude,
        longitude: resp.coords.longitude,
        distance: 2,
        distanceunit: 'km',
      };
      this.http.get<IChagingStation[]>(
        `https://api.openchargemap.io/v3/poi/`
        + `?output=json&countrycode=DE&latitude=${options.latitude}&longitude=${options.longitude}&distance=2&distanceunit=km`)
        .pipe(
          mergeMap(stations => this.getPrices(stations.map(i => i.ID)).pipe(map(prices => {
            return {
              stations,
              prices
            };
          }))),
          map(
            response => response.stations.slice(1, 10).map(i => {
              i.Price = response.prices[i.ID];
              return i;
            }).sort((a, b) => a.Price - b.Price)),
          mergeMap(stations => forkJoin(stations.map(i => {
            return this.http.get('https://route.api.here.com/routing/7.2/calculateroute.json?waypoint0='
              + 'geo!' + options.latitude + ',' + options.longitude +
              '&waypoint1=' + 'geo!' + i.AddressInfo.Latitude + ',' + i.AddressInfo.Longitude
              + '&mode=fastest%3Bcar%3Btraffic%3Aenabled&app_id=xdelknKdNQaWvEJmTI0w&app_code=a9u2g4s8up0heUvSGWmK6Q&departure=now');
          })).pipe(map(distances => {
            return {
              stations,
              distances
            };
          }))

          ),
          map((response) => {
            response.stations.forEach((i, iter) => {
              const routeSummary = (response.distances[iter] as any).response.route[0].summary;
              i.Distance = routeSummary.distance;
              i.TravelTime = routeSummary.travelTime;
            });
            return response.stations;
          })
        )
        .subscribe(data => {
          this.chargingStations.next(data);
        });

    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  private getPrices(stationIds: number[]): Observable<IPrices> {
    return this.http.post<IPrices>(this.apiHost + '/get_stations', { stations: stationIds });
  }

  getConsumption(stationId: number): void {
    this.http.get<IConsumptionResponse>(this.apiHost + '/get_consumption?stationId=' + stationId)
      .pipe(map(response => {
        const consumption: IConsumption = {
          labels: [],
          prices: []
        };
        Object.keys(response).forEach(i => {
          const date = moment(i).format('HH:mm');
          consumption.labels.push(date);
          consumption.prices.push(response[i]);
        });
        return consumption;
      }))
      .subscribe(
        data => this.consumption.next(data)
      );
  }

  private getCurrentPosition() {
    return this.geolocation.getCurrentPosition();
  }
}
