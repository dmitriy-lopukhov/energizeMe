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
          // get distance and travel time to charging stations
          this.http.get('https://route.api.here.com/routing/7.2/calculateroute.json?waypoint0='+'geo!'+options.latitude+','+options.longitude+
            '&waypoint1='+'geo!'+i.AddressInfo.Latitude+','+i.AddressInfo.Longitude+'&mode=fastest%3Bcar%3Btraffic%3Aenabled&app_id=xdelknKdNQaWvEJmTI0w&app_code=a9u2g4s8up0heUvSGWmK6Q&departure=now')
            .subscribe(data => {
              var routeSummary = data['response']['route'][0]['summary'];
              //console.log(routeSummary);
              i.Distance = routeSummary['distance'];
              i.TravelTime = routeSummary['travelTime'];
            });
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
