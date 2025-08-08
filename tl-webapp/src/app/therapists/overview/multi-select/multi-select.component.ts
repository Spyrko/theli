import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslocoPipe } from '@ngneat/transloco';
import { CARD_PATH, OVERVIEW_PATH } from '../../../translation-paths';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog, TherapistCardTs } from 'shared';
import { ToolbarOverride } from '../../../toolbar/toolbar-override.directive';

type FinishedEvent = {
  component: string;
  delete: TherapistCardTs[];
}

@Component({
  selector: 'app-multi-select-toolbar-override',
  imports: [
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    TranslocoPipe,
    MatMenuTrigger
  ],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss'
})
export class MultiSelectToolbarOverride extends ToolbarOverride<FinishedEvent> {

  constructor(private dialog: MatDialog) {
    super();
    this.config = {
      mergeButtons: false,
      showReturnArrow: true,
      titlePath: '',
    }
  }

  selectedTherapists: TherapistCardTs[] = [];

  toggleTherapist(therapist: TherapistCardTs): void {
    console.log("toggle", therapist)
    if (this.selectedTherapists.includes(therapist)) {
      this.selectedTherapists = this.selectedTherapists.filter(t => t !== therapist);
      if (this.selectedTherapists.length === 0) {
        this.finished.emit()
      }
    } else {
      this.selectedTherapists.push(therapist)
    }
  }

  onDeleteClicked(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        titlePath: OVERVIEW_PATH + ".deleteConfirm.title",
        messagePath: OVERVIEW_PATH + ".deleteConfirm.message",
        messageParams: {count: this.selectedTherapists.length},
        confirmButtonPath: OVERVIEW_PATH + ".deleteConfirm.confirm",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.finished.emit({component: "multiSelect", delete: this.selectedTherapists})
      }
    });
  }

  protected readonly CARD_PATH = CARD_PATH;
}
