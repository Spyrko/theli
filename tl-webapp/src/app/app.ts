import { Component, TemplateRef } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { APP_PATH } from './translation-paths';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Toolbar } from './toolbar/toolbar';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet,
    AsyncPipe,
    Toolbar
  ],
  styleUrl: './app.scss'
})
export class App {
  toolbarButtons$?: Observable<TemplateRef<any>>;
  titlePath$?: Observable<string>;
  showReturnArrow$?: Observable<boolean>;

  constructor() {
  }

  onActivate(component: any) {
    this.titlePath$ = component.titlePath$;
    this.showReturnArrow$ = component.showReturnArrow$;
    this.toolbarButtons$ = component.toolbarButtons$;
  }

  protected readonly APP_PATH = APP_PATH;
}
