import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "inquiries.json");

let isDirInitialized = false;
let writeQueue = Promise.resolve();

async function ensureDataDirectory() {
    if (!isDirInitialized) {
        await fs.mkdir(DATA_DIR, { recursive: true });
        isDirInitialized = true;
    }
}

export async function readInquiries() {
    try {
        const parsed = JSON.parse(await fs.readFile(DATA_FILE, "utf-8"));
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function mutateInquiries(transform) {
    const attempt = writeQueue.then(async () => {
        await ensureDataDirectory();

        const records = await readInquiries();
        const next = transform(records);
        if (next === null) return records.length;

        const tmpFile = path.join(DATA_DIR, `.inquiries.${randomUUID()}.tmp`);
        try {
            await fs.writeFile(tmpFile, JSON.stringify(next, null, 2), "utf-8");
            await fs.rename(tmpFile, DATA_FILE);
        } catch (error) {
            await fs.unlink(tmpFile).catch(() => {});
            throw error;
        }

        return next.length;
    });

    writeQueue = attempt.catch(() => {});
    return attempt;
}