import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardComponent } from './card/card.component';
import { ConfirmDialog, LongPressDirective, RequestChip, RequestStatus, TherapistCardTs, TherapistService } from 'shared';
import { Subscription } from 'rxjs';
import { Location, NgClass, NgIf } from '@angular/common';
import { ToolbarDataProvider } from '../../toolbar/toolbar-data-provider.directive';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslocoPipe } from '@ngneat/transloco';
import { CARD_PATH, OVERVIEW_PATH } from '../../translation-paths';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-overview',
  imports: [
    MatIcon,
    MatFabButton,
    RouterLink,
    CardComponent,
    LongPressDirective,
    NgClass,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    TranslocoPipe,
    MatMenuTrigger,
    MatCheckbox,
    NgIf,
    ReactiveFormsModule,
    RequestChip
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview extends ToolbarDataProvider implements OnInit, OnDestroy {
  therapists: TherapistCardTs[] = []
  filteredTherapists: TherapistCardTs[] = [];

  subscriptions: Subscription[] = [];

  multiSelectMode = false;
  selectedTherapists: TherapistCardTs[] = [];

  toolbarButtons: TemplateRef<any> | null = null;

  @ViewChild('toolbarMultiSelectButtons')
  multiSelectButtons!: TemplateRef<any>;

  filterForm!: FormGroup;

  override set buttons(value: TemplateRef<any> | null) {
    super.buttons = value;
    this.toolbarButtons = value;
  }


  constructor(private therapistService: TherapistService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private dialog: MatDialog,
              private fb: FormBuilder,) {
    super();
    this.reloadTherapists();
    this.initFilterForm(true);
  }

  private initFilterForm(value: boolean): void {


    if (!this.filterForm) {
      const savedFilterOptions = sessionStorage.getItem('therapists.filterOptions');
      if (savedFilterOptions) {
        this.filterForm = this.fb.group(JSON.parse(savedFilterOptions));
        return;
      }
    }

    const requestStatuses = Object.values(RequestStatus) as RequestStatus[];
    const requestStatusFormValues: Record<RequestStatus, boolean[]> = requestStatuses.reduce((acc, val) => {
      acc[val] = [value];
      return acc;
    }, {} as Record<RequestStatus, boolean[]>);
    this.filterForm = this.fb.group({
      all: [value],
      ...requestStatusFormValues
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.route.queryParamMap.subscribe(params => {
        const newMode = !!params.get('multiSelect');
        if (newMode !== this.multiSelectMode) {
          this.selectedTherapists = [];
          this.multiSelectMode = newMode;
          this.updateToolbar();
        }
      })
    );
  }

  onCardClick(therapist: TherapistCardTs): void {
    if (this.multiSelectMode) {
      if (this.selectedTherapists.includes(therapist)) {
        this.selectedTherapists = this.selectedTherapists.filter(t => t !== therapist);
        if (this.selectedTherapists.length === 0) {
          this.location.back()
        }
      } else {
        this.selectedTherapists.push(therapist);
      }
    } else {
      this.router.navigate([therapist.id], {relativeTo: this.route});
    }
  }

  onCardLongClick(therapist: TherapistCardTs): void {
    if (this.multiSelectMode) {
      this.onCardClick(therapist);
    } else {
      this.router.navigate([], {
        queryParams: {multiSelect: true},
        queryParamsHandling: 'merge',
      });
    }
  }

  updateToolbar(): void {
    this.titlePath = this.multiSelectMode ? '' : null;
    this.showReturnArrow = this.multiSelectMode;
    if (this.multiSelectMode) {
      this.mergeButtons = false;
      this.toolbarButtons$.next(this.multiSelectButtons);
    } else {
      this.mergeButtons = true;
      this.toolbarButtons$.next(this.toolbarButtons);
    }
  }

  reloadTherapists() {
    if (this.multiSelectMode) {
      this.location.back()
    }
    this.therapistService.getTherapists().then((therapists) => {
      this.therapists = therapists;
      this.filterTherapists();
    })
    this.updateToolbar();
  }

  protected readonly CARD_PATH = CARD_PATH;

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
        this.therapistService.deleteTherapists(this.selectedTherapists.map(t => t.id)
          .filter((id): id is number => id !== undefined))
          .then(() => {
            this.reloadTherapists()
          })
      }
    });
  }

  protected readonly RequestStatus = Object.values(RequestStatus);

  filterTherapists(all?: boolean) {
    if (all !== undefined && all !== null) {
      this.initFilterForm(all);
    } else {
      this.filterForm.patchValue({
        all: Object.keys(this.filterForm.value)
          .filter(key => key !== 'all')
          .every((key) => this.filterForm.value[key])
      })
    }
    this.filteredTherapists = this.therapists.filter(therapist =>
      this.filterForm.value[therapist.requestStatus as keyof typeof this.filterForm.value]
    );
    sessionStorage.setItem('therapists.filterOptions', JSON.stringify(this.filterForm.value));
  }

  protected readonly OVERVIEW_PATH = OVERVIEW_PATH;
}
