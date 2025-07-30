import { Directive, TemplateRef, ViewChild } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

@Directive()
export abstract class ToolbarButtonProvider {
  @ViewChild('toolbarButtons')
  protected set buttons(buttons: TemplateRef<any>) {
    this.toolbarButtons$.next(buttons);
  }

  toolbarButtons$: Subject<TemplateRef<any>> = new ReplaySubject(1)
}
