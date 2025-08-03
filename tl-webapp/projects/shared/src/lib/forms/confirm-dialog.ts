// confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';
import { SharedLibConfig } from 'shared';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.titlePath | transloco : data.titleParams }}</h2>
    <mat-dialog-content>{{ data.messagePath | transloco : data.messageParams }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button
              [mat-dialog-close]="false">{{ (data.cancelButtonPath || (config.translationPaths.confirmDialog + ".cancel")) | transloco }}
      </button>
      <button mat-button
              [mat-dialog-close]="true">{{ (data.confirmButtonPath || (config.translationPaths.confirmDialog + ".confirm")) | transloco }}
      </button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    TranslocoPipe,
    MatDialogClose
  ]
})
export class ConfirmDialog {
  constructor(
    public config: SharedLibConfig,
    @Inject(MAT_DIALOG_DATA) public data: {
      titlePath: string;
      messagePath: string;
      titleParams: any,
      messageParams: any,
      confirmButtonPath?: string;
      cancelButtonPath?: string;
    }
  ) {
  }
}
