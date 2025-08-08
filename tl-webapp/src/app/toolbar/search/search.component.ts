import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { TOOLBAR_PATH } from '../../translation-paths';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'app-search',
  imports: [
    MatIcon,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class Search {

  @Input()
  searchControl: FormControl = new FormControl();

  @Output()
  search = new EventEmitter<string>;

  onSearch(value: string) {
    this.search.emit(value)
  }

  protected readonly TOOLBAR_PATH = TOOLBAR_PATH;

  onEnterPressed(element: HTMLInputElement) {
    element.blur()
    this.onSearch(element.value)
  }
}
