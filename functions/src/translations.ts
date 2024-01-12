import type { Langugage, TranslationsKeys } from "./types";

type TranslationObj = Record<TranslationsKeys, string>;

/**
 * Ideally we would have a separate JSON files per locale or a CMS to store the translations.
 */
const TRANSLATIONS: Record<Langugage, TranslationObj> = {
  en: {
    orderNumber: "Order Number:",
    name: "Name:",
    textAbove: "Please paste this address label on the outside of the box",
    textBelow:
      "Please put this part inside the box on top of your products,\nso we can identify your return parcel upon arrival",
    postageRequired: "POSTAGE REQUIRED",
  },
  nl: {
    orderNumber: "Bestelnummer:",
    name: "Naam:",
    textAbove: "Plak dit adreslabel op de buitenkant van de doos",
    textBelow:
      "Plaats dit onderdeel in de doos bovenop uw producten,\nzodat wij uw retourpakket bij aankomst kunnen identificeren",
    postageRequired: "VERZENDKOSTEN VEREIST",
  },
};

/**
 * Only "en" and "nl" are supported for now.
 *
 * @param language The language for which the translations are required.
 *
 * @returns The translations for the given language.
 */
export const getTranslations = (language: Langugage) => {
  return TRANSLATIONS[language];
};
