import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardComponent } from './card/card.component';
import { ConfirmDialog, LongPressDirective, TherapistCardTs, TherapistService } from 'shared';
import { Subscription } from 'rxjs';
import { Location, NgClass } from '@angular/common';
import { ToolbarDataProvider } from '../../toolbar/toolbar-data-provider.directive';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslocoPipe } from '@ngneat/transloco';
import { CARD_PATH, OVERVIEW_PATH } from '../../translation-paths';
import { MatDialog } from '@angular/material/dialog';

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
    MatMenuTrigger
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class Overview extends ToolbarDataProvider implements OnInit, OnDestroy {
  therapists: TherapistCardTs[] = []

  subscriptions: Subscription[] = [];

  multiSelectMode = false;
  selectedTherapists: TherapistCardTs[] = [];

  _buttons: TemplateRef<any> | null = null;

  override set buttons(value: TemplateRef<any> | null) {
    this._buttons = value;
  }


  constructor(private therapistService: TherapistService, private route: ActivatedRoute, private router: Router, private location: Location, private dialog: MatDialog) {
    super();
    this.reloadTherapists();
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
      this.toolbarButtons$.next(this._buttons);
    } else {
      this.toolbarButtons$.next(null);
    }
  }

  reloadTherapists() {
    if (this.multiSelectMode) {
      this.location.back()
    }
    this.therapistService.getTherapists().then((therapists) => this.therapists = therapists)
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
}
