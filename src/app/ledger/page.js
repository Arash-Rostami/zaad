import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { mutateInquiries, readInquiries } from "@/lib/inquiriesStore";
import Ledger from "@/components/ledger/Ledger";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "The Ledger",
    robots: { index: false, follow: false },
};

const COOKIE_NAME = "zaad_ledger";
const TOKEN_RE = /^[0-9a-f]{64}$/;

let cachedKey;
let cachedDigest = null;
let cachedHex = null;

function getExpectedSecret() {
    const secret = process.env.ZAAD_LEDGER_KEY;
    if (!secret) return null;
    if (secret === cachedKey) {
        return { digest: cachedDigest, hex: cachedHex };
    }
    cachedKey = secret;
    cachedDigest = createHash("sha256").update(secret).digest();
    cachedHex = cachedDigest.toString("hex");
    return { digest: cachedDigest, hex: cachedHex };
}

async function unlockAction(_prev, formData) {
    "use server";
    const candidate = formData.get("key");
    const expected = getExpectedSecret();

    if (
        typeof candidate !== "string" ||
        candidate.length === 0 ||
        candidate.length > 200 ||
        !expected
    ) {
        return { error: "ledgerInvalidKey" };
    }

    const candidateDigest = createHash("sha256").update(candidate).digest();
    if (!timingSafeEqual(candidateDigest, expected.digest)) {
        return { error: "ledgerInvalidKey" };
    }

    const store = await cookies();
    store.set(COOKIE_NAME, expected.hex, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/ledger",
    });

    return { ok: true };
}

async function lockAction() {
    "use server";
    const store = await cookies();
    store.delete(COOKIE_NAME);
    store.delete({ name: COOKIE_NAME, path: "/ledger" });
}

async function isUnlocked() {
    const expected = getExpectedSecret();
    if (!expected) return false;

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (typeof token !== "string" || !TOKEN_RE.test(token)) return false;

    const tokenBuffer = Buffer.from(token, "hex");
    return tokenBuffer.length === expected.digest.length && timingSafeEqual(tokenBuffer, expected.digest);
}

async function deleteAction(sessionRef, submittedAt) {
    "use server";
    if (sessionRef == null || submittedAt == null) return;
    if (!(await isUnlocked())) return;

    try {
        await mutateInquiries((records) => {
            const next = records.filter((record) => record?.sessionRef !== sessionRef || record?.submittedAt !== submittedAt);
            return next.length === records.length ? null : next;
        });
    } catch {
        return;
    }
}

async function setViewedAction(sessionRef, submittedAt, viewed) {
    "use server";
    if (sessionRef == null || submittedAt == null) return;
    if (!(await isUnlocked())) return;

    try {
        await mutateInquiries((records) => {
            let changed = false;
            const next = records.map((record) => {
                if (record?.sessionRef === sessionRef && record?.submittedAt === submittedAt && Boolean(record.viewed) !== viewed) {
                    changed = true;
                    return { ...record, viewed };
                }
                return record;
            });
            return changed ? next : null;
        });
    } catch {
        return;
    }
}

async function loadInquiries() {
    const records = await readInquiries();
    if (records.length < 2) return records;

    return records.sort((a, b) => {
        const bTime = String(b?.submittedAt ?? "");
        const aTime = String(a?.submittedAt ?? "");
        return bTime === aTime ? 0 : bTime > aTime ? 1 : -1;
    });
}

export default async function Page() {
    const unlocked = await isUnlocked();
    const inquiries = unlocked ? await loadInquiries() : [];

    return (
        <Ledger
            unlocked={unlocked}
            inquiries={inquiries}
            unlockAction={unlockAction}
            lockAction={lockAction}
            deleteAction={deleteAction}
            setViewedAction={setViewedAction}
        />
    );
}