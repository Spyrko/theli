import { SharedLibConfig } from "shared";
import { environment } from "../../environments/environment";
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { BUSINESS_HOURS_PATH, CONFIRM_DIALOG_PATH, ENUM_PATH, ERROR_PATH } from '../translation-paths';

export const provideSharedLibConfig = (): EnvironmentProviders[] => [
  makeEnvironmentProviders([{
    provide: SharedLibConfig,
    useValue: new SharedLibConfig(environment.apiUrl, {
      businessHours: BUSINESS_HOURS_PATH,
      error: ERROR_PATH,
      enum: ENUM_PATH,
      confirmDialog: CONFIRM_DIALOG_PATH
    })
  }])
];
