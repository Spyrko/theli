import { Component } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CardComponent } from './card/card.component';
import { DayOfWeek, RequestStatus, TherapistCardTs, TherapistService } from 'shared';
import { DateTime } from 'ts-luxon';

@Component({
  selector: 'app-overview',
  imports: [
    MatIcon,
    MatFabButton,
    RouterLink,
    CardComponent
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class Overview {
  therapists: TherapistCardTs[] = []

  constructor(therapistService: TherapistService) {
    therapistService.getTherapists().then((therapists) => this.therapists = therapists)
  }
}

const therapist: TherapistCardTs = {
  name: 'John Doe',
  specialization: 'Specialization Example',
  contactTimes: [
    {
      dayOfWeek: DayOfWeek.MONDAY,
      openingTime: DateTime.fromObject({hour: 9, minute: 0}),
      closingTime: DateTime.fromObject({hour: 15, minute: 0})
    },
    {
      dayOfWeek: DayOfWeek.MONDAY,
      openingTime: DateTime.fromObject({hour: 16, minute: 0}),
      closingTime: DateTime.fromObject({hour: 19, minute: 0})
    },
    {
      dayOfWeek: DayOfWeek.FRIDAY,
      openingTime: DateTime.fromObject({hour: 8, minute: 30}),
      closingTime: DateTime.fromObject({hour: 14, minute: 30})
    }
  ],
  emailAddress: 'sample@address.com',
  phoneNumber: '123-456-7890',
  requestStatus: RequestStatus.REQUESTED,
  waitingTime: DateTime.fromObject({year: 2025, month: 10, day: 1}),
  id: 17
}
