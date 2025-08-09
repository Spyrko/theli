import { Component, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { CardComponent } from './card/card.component';
import { LongPressDirective, RequestChip, RequestStatus, TherapistCardTs, TherapistService } from 'shared';
import { filter, firstValueFrom, map, Observable, skip, Subject, Subscription, take } from 'rxjs';
import { AsyncPipe, Location, NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { ToolbarDataProvider } from '../../toolbar/toolbar-data-provider.directive';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslocoPipe } from '@ngneat/transloco';
import { OVERVIEW_PATH } from '../../translation-paths';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { sortBy, SortingAlgorithm } from './card-sorting';
import { MultiSelectToolbarOverride } from './multi-select/multi-select.component';
import { FinishedEvent, ToolbarOverride } from '../../toolbar/toolbar-override.directive';
import { SearchToolbarOverride } from '../../toolbar/search/search.toolbar-override';
import { Search } from '../../toolbar/search/search.component';

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
    RequestChip,
    AsyncPipe,
    ToolbarOverride,
    Search,
    NgTemplateOutlet,
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview extends ToolbarDataProvider implements OnDestroy {
  therapistsSubject$: Subject<TherapistCardTs[]> = new Subject<TherapistCardTs[]>();
  therapists$: Observable<TherapistCardTs[]>;
  private _therapists: TherapistCardTs[] = [];

  protected searchControl = new FormControl();

  subscriptions: Subscription[] = [];

  get multiSelectMode(): boolean {
    return !!this.multiSelectToolbarOverride;
  };

  @ViewChild('toolbarOverride', {read: ViewContainerRef, static: true})
  toolbarOverride!: ViewContainerRef

  get sortingAlgorithm(): SortingAlgorithm | null {
    return sessionStorage.getItem('therapists.sortOptions') as SortingAlgorithm;
  }

  set sortingAlgorithm(value: SortingAlgorithm) {
    sessionStorage.setItem('therapists.sortOptions', value);
  }

  multiSelectToolbarOverride?: MultiSelectToolbarOverride;

  filterForm!: FormGroup;
  private readonly filterFn: ( (cards: TherapistCardTs[]) => TherapistCardTs[] ) = (cards) => cards;
  private sortFn: ( (cards: TherapistCardTs[]) => TherapistCardTs[] ) = (cards) => cards;
  private searchFn: ( (cards: TherapistCardTs[]) => TherapistCardTs[] ) = (cards) => cards;
  private searchString: string = '';

  constructor(private therapistService: TherapistService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private fb: FormBuilder) {
    super();
    this.reloadTherapists();
    this.initFilterForm(true);
    this.therapists$ = this.therapistsSubject$.pipe(
      map((t) => this.filterFn(t)),
      map((t) => this.sortFn(t)),
      map((t) => this.searchFn(t)))
    this.filterFn = therapists => therapists.filter(therapist =>
      this.filterForm.value[therapist.requestStatus as keyof typeof this.filterForm.value]
    );
    this.searchFn = therapists => therapists.filter(therapist =>
      new RegExp(this.searchString).test(therapist.name)
    );
    this.sortBy(this.sortingAlgorithm ?? SortingAlgorithm.RELEVANCE);
    this.mergeButtons = true;
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      if (!!params.get('mode')) {
        this.location.back();
      }
    });
    this.subscriptions.push(this.route.queryParamMap.pipe(skip(1)).subscribe(params => {
        this.clearToolbarOverride();
        switch (params.get('mode')) {
          case 'multiSelect':
            this.multiSelectToolbarOverride = this.createToolbarOverride(MultiSelectToolbarOverride)
            return;
          case 'search':
            this.createToolbarOverride(SearchToolbarOverride).searchControl = this.searchControl
            return;
          default:
            return;
        }
      })
    );
  }

  private clearToolbarOverride() {
    this.toolbarOverride.clear()
    this.multiSelectToolbarOverride = undefined;
  }

  private createToolbarOverride<T extends ToolbarOverride<any>>(component: { new(...args: any[]): T }): T {
    const override = this.toolbarOverride.createComponent(component).instance;
    override.finished.subscribe(this.onToolbarOverrideFinished.bind(this))
    override.configChange.subscribe(($event) => this.configChange.emit($event))
    override.parentToolbarSettings = this.config;
    return override;
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


  onCardClick(therapist: TherapistCardTs): void {
    if (this.multiSelectMode) {
      this.multiSelectToolbarOverride?.toggleTherapist(therapist);
    } else {
      this.router.navigate([therapist.id], {relativeTo: this.route});
    }
  }

  onCardLongClick(therapist: TherapistCardTs): void {
    if (this.multiSelectMode) {
      this.onCardClick(therapist);
    } else {
      this.setMode('multiSelect').then(() => this.multiSelectToolbarOverride?.toggleTherapist(therapist));
    }
  }

  private async setMode(mode: string): Promise<boolean> {
    console.log(this.route.snapshot.queryParams['mode'])
    if (this.route.snapshot.queryParams['mode']) {
      this.location.back()

      return firstValueFrom(this.router.events.pipe(filter(event => event instanceof NavigationEnd))).then(() => {
        return this.setMode(mode)
      });
    }
    return this.router.navigate([], {
      queryParams: {mode: mode},
      queryParamsHandling: 'merge',
    });
  }

  reloadTherapists() {
    if (this.multiSelectMode) {
      this.location.back()
    }
    this.therapistService.getTherapists().then((therapists) => {
      this.setTherapists(therapists);
    })
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
    this.setTherapists();
    sessionStorage.setItem('therapists.filterOptions', JSON.stringify(this.filterForm.value));
  }

  sortBy(algorithm: SortingAlgorithm) {
    this.sortFn = sortBy(algorithm);
    this.setTherapists();
    this.sortingAlgorithm = algorithm;
  }

  toggleCheckbox(fieldName: string) {
    this.filterForm.controls[fieldName].patchValue(!this.filterForm.value[fieldName]);
  }

  deleteTherapists(therapists: TherapistCardTs[]) {
    this.therapistService.deleteTherapists(therapists.map(t => t.id)
      .filter((id): id is number => id !== undefined))
      .then(() => {
        this.reloadTherapists()
      })
  }

  onToolbarOverrideFinished($event?: FinishedEvent) {
    switch ($event?.component) {
      case "multiSelect":
        if ('delete' in $event) {
          this.deleteTherapists($event['delete'])
        }
        break;
      case "search":
        if ('search' in $event) {
          this.onSearch($event['search'])
        }
        break;
      default:
    }
    if (this.route.snapshot.queryParams['mode']) {
      this.location.back();
    }
  }

  private setTherapists(therapists = this._therapists): void {
    this._therapists = therapists;
    this.therapistsSubject$.next(therapists);
  }

  protected readonly OVERVIEW_PATH = OVERVIEW_PATH;
  protected readonly SortingAlgorithm = SortingAlgorithm;

  onSearchBtnClick() {
    this.setMode('search')
  }

  onSearch(str: string) {
    this.searchString = str;
    this.setTherapists();
  }
}
