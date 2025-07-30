import { Component, Input } from '@angular/core';
import { MatLabel } from '@angular/material/input';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-field-label',
  imports: [
    MatLabel,
    NgIf
  ],
  template: `
    <mat-label *ngIf="show">
      <ng-content></ng-content>
    </mat-label>
  `
})
export class FieldLabelComponent {
  @Input() show = true;
}
