import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Location } from './location.model';

@Injectable()
export class LocationService {
  selectedLocation: Location;
  locations: Location[];
  readonly baseURL = 'locations';

  constructor(private http: HttpClient) { }

  getLocationList() {

    return this.http.get(this.baseURL);
  }

  getSelectedLocation(locationId: number) {

    return this.http.get(this.baseURL + `/${locationId}`);
  }

  getLocationListFromCity(city: string | null) {

    return this.http.get(this.baseURL + `/${city}`);
  }

  getLocationListFromType(type: string) {

    return this.http.get(this.baseURL + `/${type}`);
  }

}
