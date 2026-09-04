export default function localizedYear(isFarsi) {
    return new Intl.NumberFormat(isFarsi ? "fa-IR" : "en-US", {useGrouping: false}).format(new Date().getFullYear());
}
