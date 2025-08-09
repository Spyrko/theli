import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { AutoErrorDirective, FieldError, FieldLabelComponent, LabelAboveDirective, RequestStatus } from 'shared';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatInput } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@ngneat/transloco';
import { DateTime } from 'ts-luxon';
import { DETAILS_PATH } from '../../../translation-paths';
import { MatSuffix } from '@angular/material/form-field';

@Component({
  selector: 'app-waiting-time',
  imports: [
    AutoErrorDirective,
    FieldError,
    FieldLabelComponent,
    LabelAboveDirective,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatSuffix,
    ReactiveFormsModule,
    TranslocoPipe
  ],
  templateUrl: './waiting-time.component.html',
  styleUrl: './waiting-time.component.scss'
})
export class WaitingTimeComponent {

  @Input()
  formControl!: FormControl;
  protected readonly DateTime = DateTime;
  protected readonly DETAILS_PATH = DETAILS_PATH;

  constructor(private cdr: ChangeDetectorRef) {
  }

  private _requestStatus?: RequestStatus;

  get requestStatus(): RequestStatus | undefined {
    return this._requestStatus;
  }

  @Input()
  set requestStatus(value: RequestStatus | undefined) {
    this._requestStatus = value;

    if (value === RequestStatus.WAITLIST_CLOSED_UNTIL) {
      this.formControl?.setValidators(Validators.required);
    } else {
      this.formControl?.clearValidators();
    }

    this.redrawWaitingTime();
  }

  private _showWaitingTime: boolean = true;

  get showWaitingTime(): boolean {
    return this._showWaitingTime && ( !this.requestStatus || [RequestStatus.WAITLISTED, RequestStatus.WAITLIST_CLOSED_UNTIL].includes(this.requestStatus) );
  }


  private redrawWaitingTime() {
    this._showWaitingTime = false;
    this.cdr.detectChanges();
    this._showWaitingTime = true;
  }
}
