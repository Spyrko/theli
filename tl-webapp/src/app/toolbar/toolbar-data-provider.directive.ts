import { Directive, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { ToolbarConfiguration } from './toolbar';

@Directive({
  selector: '[toolbarDataProvider]'
})
export class ToolbarDataProvider {
  @ViewChild('toolbarButtons')
  protected set buttons(buttons: TemplateRef<any> | null) {
    if (this.config.buttons !== buttons) {
      this.toolbarButtons = buttons;
    }
  }

  @Output()
  configChange = new EventEmitter<ToolbarConfiguration>

  set config(config: ToolbarConfiguration) {
    this._config = config;
    this.configChange.emit(config)
  }

  get config(): ToolbarConfiguration {
    return {...this._config};
  }

  private _config: ToolbarConfiguration = {};

  set showReturnArrow(showReturnArrow: boolean | undefined) {
    this.config = {...this._config, showReturnArrow}
  }

  set titlePath(titlePath: string | undefined) {
    this.config = {...this._config, titlePath}
  }

  set mergeButtons(mergeButtons: boolean | undefined) {
    this.config = {...this._config, mergeButtons}
  }

  set toolbarButtons(buttons: TemplateRef<any> | undefined | null) {
    this.config = {...this._config, buttons: buttons || undefined}
  }
}
