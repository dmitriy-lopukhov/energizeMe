import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IChagingStation } from '../types/charging-station.type';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class ChargingStationsService {
  private chargingStations = new BehaviorSubject<IChagingStation[]>(null);
  readonly chargingStations$ = this.chargingStations.asObservable();

  constructor(private http: HttpClient, private geolocation: Geolocation) { }


  getChargingStations(): void {
    this.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude, resp.coords.longitude);
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
        .subscribe(data => this.chargingStations.next(data));
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  private getCurrentPosition() {
    return this.geolocation.getCurrentPosition();
  }
}
