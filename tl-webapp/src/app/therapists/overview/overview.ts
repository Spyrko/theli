import { Component, OnInit } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardComponent } from './card/card.component';
import { LongPressDirective, TherapistCardTs, TherapistService } from 'shared';
import { Subscription } from 'rxjs';
import { Location, NgClass } from '@angular/common';
import { ToolbarDataProvider } from '../../toolbar/toolbar-data-provider.directive';

@Component({
  selector: 'app-overview',
  imports: [
    MatIcon,
    MatFabButton,
    RouterLink,
    CardComponent,
    LongPressDirective,
    NgClass
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class Overview extends ToolbarDataProvider implements OnInit {
  therapists: TherapistCardTs[] = []

  subscriptions: Subscription[] = [];

  multiSelectMode = false;
  selectedTherapists: TherapistCardTs[] = [];


  constructor(private therapistService: TherapistService, private route: ActivatedRoute, private router: Router, private location: Location) {
    super();
    this.updateToolbar();
    this.reloadTherapists();
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
  }

  reloadTherapists() {
    this.therapistService.getTherapists().then((therapists) => this.therapists = therapists)
  }
}
