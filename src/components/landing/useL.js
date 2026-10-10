import { useI18n } from "@/lib/i18n";

export default function useL() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  return { isAr, dir: isAr ? "rtl" : "ltr", L: (en, ar) => (isAr ? ar : en) };
}