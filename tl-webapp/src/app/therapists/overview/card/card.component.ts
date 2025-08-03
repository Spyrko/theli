import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { RequestChip, TherapistCardTs, TherapistService } from 'shared';
import { NgIf } from '@angular/common';
import { BusinessHoursList } from '../../details/business-hours-list/business-hours-list';
import { CARD_PATH } from '../../../translation-paths';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

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
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input()
  therapist?: TherapistCardTs;
  protected readonly CARD_PATH = CARD_PATH;

  @Output()
  updated = new EventEmitter<void>();

  constructor(private therapistService: TherapistService) {
  }

  onDeleteClicked($event: Event) {
    $event.stopPropagation();
    if (!this.therapist?.id) {
      return;
    }
    this.therapistService.deleteTherapist(this.therapist.id.toString())
      .then(() => {
        this.updated.emit();
      });
  }

}
