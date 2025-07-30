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
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Observable } from 'rxjs';

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
    NgTemplateOutlet,
    AsyncPipe
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})
export class Toolbar {

  protected readonly TOOLBAR_PATH = TOOLBAR_PATH;

  constructor(private loginService: AuthService) {
  }

  @Input()
  showReturnArrow?: boolean;

  @Input()
  titlePath!: string;

  @Input()
  buttons$?: Observable<TemplateRef<any>>;

  get isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  get userName(): string {
    return this.loginService.getUserName()!;
  }

  onReturnArrowClick(): void {
    history.back()
  }
}
