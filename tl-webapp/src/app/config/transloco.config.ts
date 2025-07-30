import { TranslocoLoader, provideTransloco } from '@ngneat/transloco';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import de from '../i18n/de.json';

@Injectable()
export class StaticTranslocoLoader implements TranslocoLoader {
  getTranslation(lang: string) {
    const translations: Record<string, any> = { de };
    return Promise.resolve(translations[lang] ?? {});
  }
}

export const provideTranslocoConfig = () =>
  provideTransloco({
    config: {
      availableLangs: ['de'],
      defaultLang: 'de',
      reRenderOnLangChange: true,
      prodMode: environment.production,
    },
    loader: StaticTranslocoLoader,
  });
