import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatChip } from '@angular/material/chips';
import { RequestStatus } from '../../rest';
import { SharedLibConfig } from '../../lib-config';
import { TranslocoPipe } from '@ngneat/transloco';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-request-chip',
  templateUrl: './request-chip.html',
  styleUrls: ['./request-chip.scss'],
  imports: [
    ReactiveFormsModule,
    MatTimepickerModule,
    MatChip,
    TranslocoPipe,
    NgIf
  ]
})
export class RequestChip {

  protected readonly ENUM_PATH;

  @Input()
  value?: RequestStatus;

  constructor(private config: SharedLibConfig) {
    this.ENUM_PATH = config.translationPaths.enum;
  }

  protected readonly RequestStatus = RequestStatus;
}
