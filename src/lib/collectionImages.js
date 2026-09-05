import fs from "node:fs";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const FA_DIGITS = { 0: "۰", 1: "۱", 2: "۲", 3: "۳", 4: "۴", 5: "۵", 6: "۶", 7: "۷", 8: "۸", 9: "۹" };
const CHUNK = 65536;
const listCache = new Map();
const dimensionCache = new Map();

function toFaDigits(value) {
    return String(value).replace(/\d/g, (d) => FA_DIGITS[d]);
}

function listSortedImages(folder) {
    const cached = listCache.get(folder);
    if (cached) return cached;
    const files = fs.readdirSync(folder).filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()));
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    listCache.set(folder, files);
    return files;
}

function readDimensions(filePath) {
    const cached = dimensionCache.get(filePath);
    if (cached) return cached;
    const dims = scanDimensions(filePath);
    dimensionCache.set(filePath, dims);
    return dims;
}

function scanDimensions(filePath) {
    const fd = fs.openSync(filePath, "r");
    try {
        let buf = Buffer.alloc(CHUNK);
        let len = fs.readSync(fd, buf, 0, CHUNK, 0);
        buf = buf.subarray(0, len);

        if (len > 24 && buf.toString("ascii", 1, 4) === "PNG") {
            return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
        }

        if (buf[0] === 0xff && buf[1] === 0xd8) {
            let offset = 2;
            for (;;) {
                while (offset >= buf.length - 9) {
                    const extra = Buffer.alloc(CHUNK);
                    const n = fs.readSync(fd, extra, 0, CHUNK, buf.length);
                    if (n === 0) return { width: 0, height: 0 };
                    buf = Buffer.concat([buf, extra.subarray(0, n)]);
                }
                if (buf[offset] !== 0xff) break;
                const marker = buf[offset + 1];
                const isSofMarker = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
                if (isSofMarker) {
                    return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
                }
                offset += 2 + buf.readUInt16BE(offset + 2);
            }
        }
        return { width: 0, height: 0 };
    } finally {
        fs.closeSync(fd);
    }
}

function plateLabel(filename, index) {
    const match = filename.match(/(\d+)(?=\.[a-z]+$)/i);
    return match ? match[1] : String(index + 1).padStart(2, "0");
}

export function resolveHomeUtensilImages() {
    const fallback = [
        { src: "/image/home/utensil-01.png", width: 297, height: 521 },
        { src: "/image/home/utensil-02.png", width: 553, height: 1379 },
    ];
    const folder = path.join(process.cwd(), "public", "image", "home");
    let files;
    try {
        files = listSortedImages(folder);
    } catch {
        return fallback;
    }
    if (!files.length) return fallback;

    return files.map((file) => {
        const { width, height } = readDimensions(path.join(folder, file));
        return { src: `/image/home/${file}`, width, height };
    });
}

export function resolveCollectionImages(item, lang) {
    const folder = path.join(process.cwd(), "public", "image", item.id);
    let files;
    try {
        files = listSortedImages(folder);
    } catch {
        return item.images;
    }
    if (!files.length) return item.images;

    return files.map((file, idx) => {
        const { width, height } = readDimensions(path.join(folder, file));
        const plate = plateLabel(file, idx);
        return {
            url: `/image/${item.id}/${file}`,
            orientation: width >= height ? "landscape" : "portrait",
            caption:
                lang === "fa"
                    ? `${item.name} - آرشیو استودیو، پلاک ${toFaDigits(plate)}`
                    : `${item.name} — Studio Archive, Plate ${plate}`,
        };
    });
}