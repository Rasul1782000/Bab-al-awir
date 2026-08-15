export interface LocalizedName {
  name_en: string;
  name_ar: string;
  name_ml: string;
  name_ta: string;
}

export interface LocalizedDesc {
  desc_en?: string;
  desc_ar?: string;
  desc_ml?: string;
  desc_ta?: string;
}

const FIELD: Record<string, keyof LocalizedName> = {
  en: "name_en",
  ar: "name_ar",
  ml: "name_ml",
  ta: "name_ta",
};

const DESC_FIELD: Record<string, keyof LocalizedDesc> = {
  en: "desc_en",
  ar: "desc_ar",
  ml: "desc_ml",
  ta: "desc_ta",
};

export function localized(item: LocalizedName, lang: string): string {
  return item[FIELD[lang] ?? "name_en"];
}

export function localizedDesc(item: LocalizedDesc, lang: string): string {
  return item[DESC_FIELD[lang] ?? "desc_en"] ?? "";
}
