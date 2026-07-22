export interface LocalizedName {
  name_en: string;
  name_ar: string;
  name_ml: string;
  name_ta: string;
}

const FIELD: Record<string, keyof LocalizedName> = {
  en: "name_en",
  ar: "name_ar",
  ml: "name_ml",
  ta: "name_ta",
};

export function localized(item: LocalizedName, lang: string): string {
  return item[FIELD[lang] ?? "name_en"];
}
