const EN_YEAR_FORMAT = new Intl.NumberFormat("en-US", { useGrouping: false });
const FA_YEAR_FORMAT = new Intl.NumberFormat("fa-IR", { useGrouping: false });

export default function localizedYear(isFarsi) {
    return (isFarsi ? FA_YEAR_FORMAT : EN_YEAR_FORMAT).format(new Date().getFullYear());
}
