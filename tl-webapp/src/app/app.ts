import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { APP_PATH } from './translation-paths';
import { Toolbar, ToolbarConfiguration } from './toolbar/toolbar';
import { ToolbarDataProvider } from './toolbar/toolbar-data-provider.directive';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet,
    Toolbar
  ],
  styleUrl: './app.scss'
})
export class App {

  defaultToolbarConfig: ToolbarConfiguration = {
    titlePath: `${APP_PATH}.title`,
    showReturnArrow: false,
    mergeButtons: false,
  }

  toolbarConfig: ToolbarConfiguration = this.defaultToolbarConfig;


  constructor(private cdr: ChangeDetectorRef) {
  }


  onToolbarConfigChanged($event: ToolbarConfiguration) {
    this.toolbarConfig = {...this.defaultToolbarConfig, ...$event};
    this.cdr.detectChanges()
  }

  onActivate($event: any) {
    if ($event instanceof ToolbarDataProvider) {
      $event.configChange.subscribe(this.onToolbarConfigChanged.bind(this))
    }
  }
}
