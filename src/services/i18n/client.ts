import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { getOptions } from './config';

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) =>
      import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getOptions(),
    lng: 'pt',
    fallbackLng: 'pt',
    supportedLngs: ['pt'],
  });

export default i18next;
