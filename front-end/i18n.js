import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // Fallback language
    lng: 'en', // Default language
    debug: true, // Enable debugging
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    resources: {
      en: {
        common: {
          login: "Login",
          username: "Username",
          password: "Password",
          submit: "Submit",
          error: "Invalid username or password.",
        },
      },
      nl: {
        common: {
          login: "Inloggen",
          username: "Gebruikersnaam",
          password: "Wachtwoord",
          submit: "Inloggen",
          error: "Ongeldige gebruikersnaam of wachtwoord.",
        },
      },
    },
  });

export default i18n;
