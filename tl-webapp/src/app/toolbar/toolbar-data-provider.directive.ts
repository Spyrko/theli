import { Directive, TemplateRef, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Directive()
export abstract class ToolbarDataProvider {
  @ViewChild('toolbarButtons')
  protected set buttons(buttons: TemplateRef<any>) {
    this.toolbarButtons$.next(buttons);
  }

  toolbarButtons$ = new ReplaySubject<TemplateRef<any>>(1)
  titlePath$ = new ReplaySubject<string | null>(1);
  showReturnArrow$ = new ReplaySubject<boolean>(1);

  set showReturnArrow(show: boolean) {
    this.showReturnArrow$.next(show);
  }

  set titlePath(path: string | null) {
    this.titlePath$.next(path);
  }
}
