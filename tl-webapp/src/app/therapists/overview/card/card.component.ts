import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { RequestChip, TherapistCardTs } from 'shared';
import { NgIf } from '@angular/common';
import { BusinessHoursList } from '../../details/business-hours-list/business-hours-list';
import { CARD_PATH } from '../../../translation-paths';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'app-card',
  imports: [
    MatCard,
    NgIf,
    MatCardHeader,
    MatCardContent,
    BusinessHoursList,
    MatCardTitle,
    MatCardSubtitle,
    TranslocoPipe,
    RequestChip,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input()
  therapist?: TherapistCardTs;
  protected readonly CARD_PATH = CARD_PATH;
}
