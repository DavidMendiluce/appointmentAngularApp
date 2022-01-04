import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Appointment } from './appointment.model';

@Injectable()
export class AppointmentService {
  selectedAppointment: Appointment;
  appointments: Appointment[];
  readonly baseURL = 'http://localhost:3000/appointments';

  constructor(private http: HttpClient) { }

  postAppointment(apm: Appointment) {
    console.log('reachedService');
    return this.http.post(this.baseURL, apm);

  }

  getAppointmentList() {
    return this.http.get(this.baseURL);
  }

  putAppointment(apm: Appointment) {
    return this.http.put(this.baseURL + `/${apm._id}`, apm);

  }

  deleteAppointment(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }
}
