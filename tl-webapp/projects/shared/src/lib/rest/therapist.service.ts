import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { TherapistCardTs, TherapistTs } from 'shared';

@Injectable({providedIn: 'root'})
export class TherapistService {
  constructor(private http: HttpService) {
  }

  async putTherapist(therapist: TherapistTs): Promise<TherapistTs> {
    return await this.http.put<TherapistTs>("therapists/", therapist);
  }

  async getTherapist(id: string): Promise<TherapistTs> {
    return await this.http.get<TherapistTs>("therapists/" + id);
  }

  async getTherapists(): Promise<TherapistCardTs[]> {
    return await this.http.get<TherapistCardTs[]>("therapists/")
  }

  async deleteTherapist(id: string | number): Promise<void> {
    return await this.http.delete("therapists/" + id);
  }

  async deleteTherapists(ids: ( string | number )[]): Promise<void> {
    return await this.http.delete("therapists/", {ids});
  }

}
