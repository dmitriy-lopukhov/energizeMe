import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { IChagingStation } from '../types/charging-station.type';

@Injectable({
  providedIn: 'root'
})
export class ChargingStationsService {
  private chargingStations = new BehaviorSubject<IChagingStation[]>(null);
  readonly chargingStations$ = this.chargingStations.asObservable();

  constructor(private http: HttpClient) { }


  getChargingStations(latitude: number, longitude: number): void {
    const options = {
      output: 'json',
      countrycode: 'DE',
      latitude,
      longitude,
      distance: 2,
      distanceunit: 'km',
    };
    this.http.get<IChagingStation[]>(`https://api.openchargemap.io/v3/poi/?output=json&countrycode=DE&latitude=${options.latitude}&longitude=${options.longitude}&distance=2&distanceunit=km`)
      .subscribe(data => this.chargingStations.next(data));
  }
}
