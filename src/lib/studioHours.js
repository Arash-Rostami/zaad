const OPEN_HOUR = 9;
const CLOSE_HOUR = 18;
const CLOSED_WEEKDAY = "Fri";

const TEHRAN_FORMATTER = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    weekday: "short",
    hour: "numeric",
    hour12: false,
});

export function isStudioOpenNow(date = new Date()) {
    const parts = TEHRAN_FORMATTER.formatToParts(date);

    const weekday = parts.find((p) => p.type === "weekday")?.value;
    const hour = Number(parts.find((p) => p.type === "hour")?.value);

    return weekday !== CLOSED_WEEKDAY && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}