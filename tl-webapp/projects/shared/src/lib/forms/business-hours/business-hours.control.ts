import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatFormFieldControl, MatSuffix } from '@angular/material/form-field';
import { BusinessHours, DayOfWeek } from '../../rest';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NgControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { NgForOf } from '@angular/common';
import { SharedLibConfig } from '../../lib-config';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgxMatTimepickerComponent, NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { DateTime } from 'ts-luxon';
import { ENUM_PATH } from '../../../../../../src/app/translation-paths';

const allRequiredValidator =
  (control: AbstractControl): ValidationErrors | null => {
    if (!control.value?.dayOfWeek || !control.value?.openingTime || !control.value?.closingTime) {
      return {allRequired: true};
    }
    return null;
  };

const timePatternValidator = (businessHoursControl: BusinessHoursControl) =>
  (): ValidationErrors | null => {
    if (Object.values(businessHoursControl.parts.controls).some((control) => !!control.errors?.['pattern'])) {
      return {timePattern: true};
    }
    return null;
  };


@Component({
  selector: 'app-business-hours-input',
  templateUrl: './business-hours.control.html',
  styleUrls: ['./business-hours.control.scss'],
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatSelect,
    MatTimepickerModule,
    MatOption,
    NgForOf,
    TranslocoPipe,
    MatIcon,
    MatIconButton,
    MatSuffix,
    NgxMatTimepickerComponent,
    NgxMatTimepickerModule
  ],
  providers: [{provide: MatFormFieldControl, useExisting: BusinessHoursControl}]
})
export class BusinessHoursControl implements MatFormFieldControl<BusinessHours>, OnInit, OnDestroy, DoCheck, ControlValueAccessor, AfterViewInit {

  @ViewChildren(MatFormFieldControl)
  formFieldControls!: QueryList<MatInput | MatSelect>;

  @ViewChild('dayOfWeekSelect', {read: MatSelect})
  dayOfWeekSelect!: MatSelect;

  @ViewChild('openingInput', {read: ElementRef})
  openingInputRef!: ElementRef<HTMLInputElement>;

  @ViewChild('closingInput', {read: ElementRef})
  closingInputRef!: ElementRef<HTMLInputElement>;

  @ViewChild('openingPicker')
  openingPicker!: NgxMatTimepickerComponent;

  @ViewChild('closingPicker')
  closingPicker!: NgxMatTimepickerComponent;

  private _value?: BusinessHours | null = null;
  parts: FormGroup;

  stateChanges = new Subject<void>();


  constructor(@Self() @Optional() public ngControl: NgControl,
              @Optional() public parentFormField: MatFormField,
              private _elementRef: ElementRef<HTMLElement>,
              private sharedLibConfig: SharedLibConfig,
              formBuilder: FormBuilder,
              private errorStateMatcher: ErrorStateMatcher) {
    this.parts = formBuilder.group({
      dayOfWeek: ['', Validators.required],
      openingTime: ['', Validators.required],
      closingTime: ['', Validators.required]
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.BUSINESS_HOURS_PATH = this.sharedLibConfig.translationPaths.businessHours;
  }

  ngOnInit(): void {
    this.ngControl.control?.addValidators([timePatternValidator(this), allRequiredValidator]);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.formFieldControls.forEach((control) => this.registerListener(control));
    })
  }

  private registerListener(control: MatInput | MatSelect) {
    const valueAccessor = control.ngControl!.valueAccessor as unknown as {
      onChange: (value: any) => void,
      _onChange: (value: any) => void,
      onTouched: () => void,
      _onTouched: () => void,
      registerOnChange: (fn: (value: any) => void) => void,
      registerOnTouched: (fn: () => void) => void
    };

    const oldChangeFn = valueAccessor._onChange || valueAccessor.onChange
    valueAccessor.registerOnChange((newValue: any) => {
      oldChangeFn(newValue);
      this.onChange(this.value);
    })

    const oldTouchedFn = valueAccessor._onTouched || valueAccessor.onTouched;
    valueAccessor.registerOnTouched(( () => {
      oldTouchedFn();
      if (this.touched) {
        this.onTouched();
      }
    } ) as any);

    control.stateChanges.subscribe(() => this.stateChanges.next());
  }

  get touched(): boolean {
    return Object.values(this.parts.controls).every(control => control.touched)
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  static nextId = 0;
  @HostBinding() id = `app-business-hours-input-${BusinessHoursControl.nextId++}`;

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
  }

  private _placeholder = "";

  get focused(): boolean {
    return this.formFieldControls?.some(control => control.focused);
  }

  onTouched: () => void = () => {
  };
  onChange: (newValue: any) => void = () => {
  };

  get empty() {
    let n = this.parts.value;
    return !n.dayOfWeek && !n.openingTime && !n.closingTime;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return true;
  }


  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.formFieldControls.forEach(control => control.required = this._required)
  }

  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
  }

  private _disabled = false;

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  errorState: boolean = false;

  protected updateErrorState() {
    const oldState = this.errorState;
    const matcher = this.errorStateMatcher;
    const control = this.ngControl?.control;

    const hasOpeningTimePatternError = this.parts.controls['openingTime'].hasError('pattern') && this.errorStateMatcher.isErrorState(this.parts.controls['openingTime'], null)
    const hasClosingTimePatternError = this.parts.controls['closingTime'].hasError('pattern') && this.errorStateMatcher.isErrorState(this.parts.controls['closingTime'], null);


    const newState = matcher.isErrorState(control, null) || hasOpeningTimePatternError || hasClosingTimePatternError;
    if (newState !== oldState) {
      this.errorState = newState;
      this.stateChanges.next();
    }
  }


  controlType = 'app-business-hours-input';
  autofilled?: boolean | undefined;
  disableAutomaticLabeling?: boolean | undefined;

  get value(): BusinessHours | null {
    const val = this.parts.value;
    return val ? {id: this._value?.id, dayOfWeek: val.dayOfWeek, openingTime: val.openingTime, closingTime: val.closingTime} : null;
  }

  set value(value: BusinessHours | null) {
    this._value = value;
    if (value) {
      this.parts.setValue({
        dayOfWeek: value.dayOfWeek,
        openingTime: value.openingTime,
        closingTime: value.closingTime
      });
    } else {
      this.parts.reset();
    }
    this.stateChanges.next();
  }

  @Input('aria-describedby')
  userAriaDescribedBy?: string;

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement
      .querySelector('.app-business-hours-input-container')!;
    controlElement?.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick(event: MouseEvent) {
    const validFields: string[] = ['input', 'mat-select', 'mat-icon', 'button'];
    const validFieldClicked = validFields.some(field => thisOrParentOfType(event.target as Element, field));
    if (!validFieldClicked) {
      if (!this.parts.value.dayOfWeek) {
        this.dayOfWeekSelect.open();
      } else if (!this.parts.value.openingTime) {
        this.openingInputRef.nativeElement.focus();
        this.openingPicker.open();
      } else if (!this.parts.value.closingTime) {
        this.closingInputRef.nativeElement.focus();
        this.closingPicker.open();
      }
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  protected readonly DayOfWeek = Object.values(DayOfWeek);
  protected readonly BUSINESS_HOURS_PATH: string;

  @Output()
  readonly acceptClicked = new EventEmitter<void>();

  @Output()
  readonly removeClicked = new EventEmitter<void>();

  @Output()
  readonly editClicked = new EventEmitter<void>();
  timeRegex = '^([01]?[0-9]|2[0-3]):[0-5][0-9]$';

  maxTime = DateTime.fromObject({hour: 23, minute: 59});
  minTime = DateTime.fromObject({hour: 0, minute: 0});

  onAcceptClicked() {
    console.log("acc", this.ngControl.value)
    this.parts.markAllAsTouched();
    this.parts.updateValueAndValidity();
    this.ngControl.control?.markAsTouched();
    this.ngControl.control?.updateValueAndValidity()
    if (this.ngControl.valid) {
      this.acceptClicked.emit();
    }
  }

  onRemoveClicked() {
    this.removeClicked.emit();
  }

  onEditClicked() {
    this.editClicked.emit();
  }

  hasErrorState(input: HTMLInputElement): boolean {
    const formControlName = input.getAttribute('formControlName')!;
    return this.errorStateMatcher.isErrorState(this.parts.controls[formControlName], null);
  }

  setTime(input: HTMLInputElement, $event: string) {
    const formControlName = input.getAttribute('formControlName')!;
    this.parts.controls[formControlName].setValue($event)
    this.onChange(this.value)
  }

  protected readonly ENUM_PATH = ENUM_PATH;
}

function thisOrParentOfType(element: Element, type: string): boolean {
  return element.tagName.toLowerCase() === type.toLowerCase() || ( !!element.parentElement && thisOrParentOfType(element.parentElement, type) );
}
