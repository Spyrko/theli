import { Component, ElementRef, Input, Optional, Self, } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { AutoErrorDirective, BusinessHours, BusinessHoursControl, dateToTimeString, FieldError } from 'shared';
import { MatFormField } from '@angular/material/input';
import { BUSINESS_HOURS_PATH, DETAILS_PATH, ENUM_PATH } from '../../../translation-paths';
import { MatCell, MatCellDef, MatColumnDef, MatRow, MatRowDef, MatTable } from '@angular/material/table';
import { TranslocoPipe } from '@ngneat/transloco';


@Component({
  selector: 'app-business-hours-list',
  imports: [
    MatFormField,
    AutoErrorDirective,
    FieldError,
    BusinessHoursControl,
    ReactiveFormsModule,
    BusinessHoursControl,
    MatTable,
    MatColumnDef,
    MatCell,
    TranslocoPipe,
    MatRow,
    MatRowDef,
    MatCellDef,

  ],
  templateUrl: './business-hours-list.html',
  styleUrl: './business-hours-list.css'
})
export class BusinessHoursList implements ControlValueAccessor {

  formControls: FormControl<BusinessHours | null>[] = [];
  createFormControl?: FormControl<BusinessHours | null>;

  @Input()
  disabled = false;

  @Input()
  set businessHours(value: BusinessHours[] | undefined) {
    if (value) {
      this.writeValue(value);
    } else {
      this.formControls = [];
    }
  }

  constructor(@Self() @Optional() public ngControl: NgControl, private elRef: ElementRef<HTMLElement>) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    this.createFormControl = new FormControl<BusinessHours | null>(null);
  }

  writeValue(obj: any): void {
    this.formControls = ( obj as BusinessHours[] ).filter(bh => !!bh).map(bh => new FormControl<BusinessHours | null>(bh));
    this.formControls.forEach(control => control.disable());
    this.sortControls()
  }

  _onChange: (value: BusinessHours[]) => void = () => {
  };

  private onChange(): void {
    this._onChange(this.formControls.map(control => control.value).filter(bh => !!bh));
  }

  registerOnChange(fn: any): void {
    this._onChange = fn
  }

  registerOnTouched(fn: any): void {
    // No-op, as this component does not have a touch interaction
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get displayedColumns(): string[] {
    const businessHoursColumns = this.businessHoursIndices.map(i => `businessHours${i}`);
    return ['dayOfWeek', 'spacer', ...businessHoursColumns];
  }

  get businessHoursIndices(): number[] {
    return Array.from({length: this.numberOfBusinessHourColumns}, (_, i) => i);
  }

  get numberOfBusinessHourColumns(): number {
    return this.tableData.reduce((acc, row) => Math.max(acc, row.businessHours.length), 0)
  }

  get tableData(): Row[] {
    return this.formControls
      .map(control => control.value)
      .filter(bh => !!bh)
      .reduce((acc, bh): Row[] => {
        const rowOfDay = acc.find((row) => row.dayOfWeek === bh.dayOfWeek)
        if (rowOfDay) {
          rowOfDay.businessHours.push(`${dateToTimeString(bh.openingTime)} \u2013 ${dateToTimeString(bh.closingTime)}`);
        } else {
          acc.push({
            dayOfWeek: bh.dayOfWeek,
            businessHours: [`${dateToTimeString(bh.openingTime)} \u2013 ${dateToTimeString(bh.closingTime)}`]
          });
        }
        return acc;
      }, [] as Row[])
  }

  addControl() {
    this.createFormControl!.disable()
    this.formControls.push(this.createFormControl!);
    this.sortControls();
    this.createFormControl = new FormControl<BusinessHours | null>(null);
    this.onChange();
  }

  private sortControls() {
    this.formControls.sort((a, b) => {
      const dayA = a.value?.dayOfWeek ?? '';
      const dayB = b.value?.dayOfWeek ?? '';
      const openingTimeA = a.value?.openingTime ?? '';
      const openingTimeB = b.value?.openingTime ?? '';
      return dayA < dayB ? -1 : dayA > dayB ? 1 :
        openingTimeA < openingTimeB ? -1 : openingTimeA > openingTimeB ? 1 : 0;
    });
  }

  protected readonly DETAILS_PATH = DETAILS_PATH;

  removeControl(control: FormControl<BusinessHours | null>) {
    this.formControls = this.formControls.filter(ctrl => ctrl !== control);
    this.onChange();
  }

  editControl(control: FormControl<BusinessHours | null>) {
    this.createFormControl = undefined;
    control.enable();
  }

  finishEditControl(control: FormControl<BusinessHours | null>) {
    this.createFormControl = new FormControl<BusinessHours | null>(null);
    control.disable();
    this.sortControls();
    this.onChange();
  }

  protected readonly BUSINESS_HOURS_PATH = BUSINESS_HOURS_PATH;
  protected readonly ENUM_PATH = ENUM_PATH;
}

interface Row {
  dayOfWeek: string;
  businessHours: string[];
}
