import { Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ToolbarDataProvider } from './toolbar-data-provider.directive';
import { ToolbarConfiguration } from './toolbar';

export type FinishedEvent = Record<string, any> & { component: string }

@Directive({
  selector: '[toolbarOverride]',
  exportAs: 'toolbarOverride'
})
export class ToolbarOverride<T extends FinishedEvent> extends ToolbarDataProvider implements OnDestroy {

  @Output()
  finished: EventEmitter<T> = new EventEmitter<T>();

  @Input()
  parentToolbarSettings: ToolbarConfiguration = {};

  ngOnDestroy(): void {
    this.configChange.emit(this.parentToolbarSettings);
  }
}
