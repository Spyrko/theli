import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToolbarOverride } from '../toolbar-override.directive';
import { Search } from './search.component';

type FinishedEvent = {
  component: string;
  search: string;
}

@Component({
  selector: 'app-search-toolbar-override',
  imports: [
    ReactiveFormsModule,
    Search,
  ],
  template: `
    <ng-template #toolbarCenter>
      <app-search [searchControl]="searchControl" (search)="onSearch($event)"/>
    </ng-template>
    <ng-template #toolbarButtons></ng-template>`,
  styleUrl: './search.component.scss'
})
export class SearchToolbarOverride extends ToolbarOverride<FinishedEvent> {

  @Input()
  searchControl: FormControl = new FormControl();

  constructor() {
    super();
    this.mergeButtons = false;
    this.showReturnArrow = true;
    this.titlePath = '';
  }

  onSearch(value: string) {
    this.finished.emit({component: "search", search: value})
  }
}
