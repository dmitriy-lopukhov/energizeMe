import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ChargingStationsService } from '../core/services/charging-stations.service';
import { Observable } from 'rxjs';
import { IChagingStation } from '../core/types/charging-station.type';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  chargingStations$: Observable<IChagingStation[]>;

  constructor(private geolocation: Geolocation,
    private chargingStationsService: ChargingStationsService) {
    this.chargingStations$ = this.chargingStationsService.chargingStations$;

    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude, resp.coords.longitude);
      this.chargingStationsService.getChargingStations(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    //  let watch = this.geolocation.watchPosition();
    //   watch.subscribe((data) => {
    //   // data can be a set of coordinates, or an error (if an error occurred).
    //   // data.coords.latitude
    //   // data.coords.longitude
    //   });

  }





}
