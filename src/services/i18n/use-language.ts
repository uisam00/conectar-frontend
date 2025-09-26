import { useTranslation } from 'react-i18next';

export default function useLanguage(namespace?: string) {
  const { t, i18n } = useTranslation(namespace);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return {
    t,
    changeLanguage,
    currentLanguage: i18n.language,
  };
}
