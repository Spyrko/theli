import { Component, Input, TemplateRef } from '@angular/core';
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";
import { RouterLink } from "@angular/router";
import { TranslocoPipe } from "@ngneat/transloco";
import { TOOLBAR_PATH } from '../translation-paths';
import { AuthService } from 'shared';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { AvatarModule } from 'ngx-avatars';
import { Location, NgTemplateOutlet } from '@angular/common';

export type ToolbarConfiguration = {
  showReturnArrow?: boolean;
  titlePath?: string;
  buttons?: TemplateRef<any>;
  mergeButtons?: boolean;
}

@Component({
  selector: 'app-toolbar',
  imports: [
    MatButton,
    MatToolbar,
    MatToolbarRow,
    RouterLink,
    TranslocoPipe,
    AvatarModule,
    MatMenu,
    MatIcon,
    MatMenuItem,
    MatMenuTrigger,
    MatIconButton,
    NgTemplateOutlet
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})
export class Toolbar {
  get config(): ToolbarConfiguration {
    return this._config;
  }

  @Input()
  set config(value: ToolbarConfiguration) {
    this._config = value;
  }

  protected readonly TOOLBAR_PATH = TOOLBAR_PATH;

  constructor(private authService: AuthService, private location: Location) {
  }

  private _config: ToolbarConfiguration = {};

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userName(): string {
    return this.authService.getUserName()!;
  }

  onReturnArrowClick(): void {
    this.location.back()
  }
}
