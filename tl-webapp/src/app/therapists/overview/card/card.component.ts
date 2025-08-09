import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { ConfirmDialog, RequestChip, TherapistCardTs, TherapistService } from 'shared';
import { NgIf } from '@angular/common';
import { BusinessHoursList } from '../../details/business-hours-list/business-hours-list';
import { CARD_PATH, OVERVIEW_PATH } from '../../../translation-paths';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

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
    MatCardActions,
    MatButton,
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

  constructor(private therapistService: TherapistService, private dialog: MatDialog) {
  }

  onDeleteClicked() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        titlePath: OVERVIEW_PATH + ".deleteConfirm.title",
        messagePath: CARD_PATH + ".deleteConfirm.message",
        messageParams: {name: this.therapist?.name},
        confirmButtonPath: OVERVIEW_PATH + ".deleteConfirm.confirm",
        warn: true,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        if (!this.therapist?.id) {
          return;
        }
        this.therapistService.deleteTherapist(this.therapist.id.toString())
          .then(() => {
            this.updated.emit();
          });
      }
    });
  }

  startCall(value: string) {
    window.location.href = `tel:${value}`;
  }

}
