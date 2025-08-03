import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import {
  AutoErrorDirective,
  FieldError,
  FieldLabelComponent,
  LabelAbove,
  LabelAboveDirective,
  RequestChip,
  RequestStatus,
  TherapistService,
  TherapistTs
} from 'shared';
import { MatDivider } from '@angular/material/divider';
import { BusinessHoursList } from './business-hours-list/business-hours-list';
import { DETAILS_PATH, ENUM_PATH } from '../../translation-paths';
import { MatButton, MatIconButton } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';
import { ToolbarDataProvider } from '../../toolbar/toolbar-data-provider.directive';
import { TextareaDirective } from './text-area.directive';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { DateTime } from 'ts-luxon';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';


@Component({
  selector: 'app-details',
  imports: [
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    BusinessHoursList,
    FieldError,
    AutoErrorDirective,
    LabelAboveDirective,
    FieldLabelComponent,
    LabelAbove,
    MatDivider,
    TextareaDirective,
    MatButton,
    TranslocoPipe,
    MatIconButton,
    MatIcon,
    NgIf,
    MatSelect,
    MatOption,
    MatSuffix,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    RequestChip,
    MatSelectTrigger
  ],
  templateUrl: './details.html',
  styleUrl: './details.scss'
})
export class Details extends ToolbarDataProvider implements AfterViewInit, OnInit {
  isCreateMode = false;
  isEditMode = false;
  therapistForm?: FormGroup;
  protected readonly DETAILS_PATH = DETAILS_PATH;
  @ViewChildren(TextareaDirective, {read: ElementRef})
  private textAreas!: QueryList<ElementRef<HTMLTextAreaElement>>;
  private loadedTherapist?: TherapistTs;

  get showWaitingTime(): boolean {
    return this.therapistForm?.get('requestStatus')?.value === RequestStatus.WAITLISTED;
  }


  setTherapistForm(therapist?: TherapistTs) {
    this.therapistForm = this.fb.group({
      name: [therapist?.name || '', Validators.required],
      emailAddress: [therapist?.emailAddress || '', [Validators.email]],
      phoneNumber: [therapist?.phoneNumber || ''],
      contactTimes: [therapist?.contactTimes || []],
      address: [therapist?.address || ''],
      specialization: [therapist?.specialization || ''],
      notes: [therapist?.notes || ''],
      rating: [therapist?.rating || ''],
      contactHistory: [therapist?.contactHistory || []],
      waitingTime: [therapist?.waitingTime || null],
      requestStatus: [therapist?.requestStatus || RequestStatus.NOT_REQUESTED]
    });
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private therapistService: TherapistService) {
    super();
    this.showReturnArrow = true;
  }

  private get therapistTs(): TherapistTs {
    return {
      id: this.loadedTherapist?.id,
      requestStatus: this.therapistForm?.get('requestStatus')?.value,
      contactHistory: this.therapistForm?.get('contactHistory')?.value,
      waitingTime: this.therapistForm?.get('waitingTime')?.value,
      name: this.therapistForm?.get('name')?.value,
      specialization: this.therapistForm?.get('specialization')?.value,
      address: this.therapistForm?.get('address')?.value,
      phoneNumber: this.therapistForm?.get('phoneNumber')?.value,
      emailAddress: this.therapistForm?.get('emailAddress')?.value,
      contactTimes: this.therapistForm?.get('contactTimes')?.value,
      notes: this.therapistForm?.get('notes')?.value,
      rating: this.therapistForm?.get('rating')?.value
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    if (id === null) {
      this.router.navigate(['404'])
      return
    }
    this.isCreateMode = id === 'new';
    this.titlePath = this.isCreateMode ? DETAILS_PATH + ".createTitle" : DETAILS_PATH + ".title";
    if (!this.isCreateMode) {
      this.therapistService.getTherapist(id).then((therapist) => {
          this.loadedTherapist = therapist;
          this.setTherapistForm(therapist);
          this.therapistForm?.disable();
        }
      )
    } else {
      this.setTherapistForm();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.textAreas.forEach(textareaRef => {
        this.resizeTextarea(textareaRef.nativeElement);
        textareaRef.nativeElement.addEventListener('input', () => this.resizeTextarea(textareaRef.nativeElement));
      })
    })
  }

  onSubmit() {
    if (this.therapistForm?.valid) {
      // Handle form submission logic here
      this.therapistService.putTherapist(this.therapistTs).then(therapist => {
        this.loadedTherapist = therapist;
        this.setTherapistForm(therapist);
        this.isEditMode = false;
        this.isCreateMode = false;
        this.therapistForm?.disable();
      })
    }
  }

  onEdit() {
    this.isEditMode = true;
    this.therapistForm?.enable();
  }

  resizeTextarea(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
  }

  protected readonly RequestStatus = Object.values(RequestStatus);
  protected readonly ENUM_PATH = ENUM_PATH;
  protected readonly DateTime = DateTime;
}


