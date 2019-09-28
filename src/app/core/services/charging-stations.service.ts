import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IChagingStation } from '../types/charging-station.type';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChargingStationsService {
  private readonly apiHost = 'https://energizehackathonka2019.herokuapp.com';
  private chargingStations = new BehaviorSubject<IChagingStation[]>(null);
  readonly chargingStations$ = this.chargingStations.asObservable();

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
      // this.http.get<IChagingStation[]>(`/api/v1/getstations/?latitude=${options.latitude}&longitude=${options.longitude}`)
      //   .subscribe(data => this.chargingStations.next(data));
      this.http.get<IChagingStation[]>(`https://api.openchargemap.io/v3/poi/?output=json&countrycode=DE&latitude=${options.latitude}&longitude=${options.longitude}&distance=2&distanceunit=km`)
        .pipe(map(data => data.map(i => {
          i.Price = Math.random();
          return i;
        })))
        .subscribe(data => this.chargingStations.next(data));


      // this.http.get(this.apiHost).subscribe();
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  private getCurrentPosition() {
    return this.geolocation.getCurrentPosition();
  }
}
