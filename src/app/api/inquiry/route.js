import crypto from "node:crypto";
import { mutateInquiries } from "@/lib/inquiriesStore";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s().-]{6,19}$/;
const CONSULTATION_VALUES = new Set(["acquisition", "consultation", "visit"]);
const APPOINTMENT_MODE_VALUES = new Set(["call", "audience"]);
const APPOINTMENT_WINDOW_VALUES = new Set(["", "morning-1", "morning-2", "midday", "evening-1", "evening-2"]);
const MAX_NAME_LENGTH = 100;
const MAX_NOTE_LENGTH = 2000;

function validateInquiry(body) {
    const errors = {};
    let hasErrors = false;

    const name = typeof body.clientName === "string" ? body.clientName.trim() : "";
    const email = typeof body.clientEmail === "string" ? body.clientEmail.trim() : "";
    const phone = typeof body.clientPhone === "string" ? body.clientPhone.trim() : "";
    const note = typeof body.additionalNote === "string" ? body.additionalNote.trim() : "";
    const consultation = body.desiredConsultation;
    const appointmentMode = body.appointmentMode;
    const appointmentWindow = typeof body.appointmentWindow === "string" ? body.appointmentWindow : "";

    if (!name || name.length < 2) {
        errors.clientName = "formErrorNameRequired";
        hasErrors = true;
    } else if (name.length > MAX_NAME_LENGTH) {
        errors.clientName = "formErrorNameTooLong";
        hasErrors = true;
    }

    if (email && !EMAIL_RE.test(email)) {
        errors.clientEmail = "formErrorEmailInvalid";
        hasErrors = true;
    }

    if (!phone) {
        errors.clientPhone = "formErrorPhoneRequired";
        hasErrors = true;
    } else if (!PHONE_RE.test(phone)) {
        errors.clientPhone = "formErrorPhoneInvalid";
        hasErrors = true;
    }

    if (!CONSULTATION_VALUES.has(consultation)) {
        errors.desiredConsultation = "formErrorConsultationInvalid";
        hasErrors = true;
    }

    if (appointmentMode !== undefined && !APPOINTMENT_MODE_VALUES.has(appointmentMode)) {
        errors.appointmentMode = "formErrorConsultationInvalid";
        hasErrors = true;
    }

    if (!APPOINTMENT_WINDOW_VALUES.has(appointmentWindow)) {
        errors.appointmentWindow = "formErrorConsultationInvalid";
        hasErrors = true;
    } else if (!appointmentWindow) {
        errors.appointmentWindow = "formErrorAppointmentWindowRequired";
        hasErrors = true;
    }

    if (note.length > MAX_NOTE_LENGTH) {
        errors.additionalNote = "formErrorNoteTooLong";
        hasErrors = true;
    }

    return {
        hasErrors,
        errors,
        clean: { name, email, phone, note, consultation, appointmentMode, appointmentWindow },
    };
}

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return Response.json({ ok: false, error: "formErrorGeneric" }, { status: 400 });
    }

    const payload = body && typeof body === "object" ? body : {};
    const { hasErrors, errors, clean } = validateInquiry(payload);
    if (hasErrors) {
        return Response.json({ ok: false, errors }, { status: 400 });
    }

    const sessionRef = crypto.randomInt(10000, 100000);

    const record = {
        sessionRef,
        clientName: clean.name,
        clientEmail: clean.email,
        clientPhone: clean.phone || null,
        desiredConsultation: clean.consultation,
        additionalNote: clean.note || null,
        appointmentMode: clean.appointmentMode ?? null,
        appointmentWindow: clean.appointmentWindow || null,
        language: payload.language === "fa" ? "fa" : "en",
        submittedAt: new Date().toISOString(),
        viewed: false,
    };

    try {
        await mutateInquiries((records) => [...records, record]);
    } catch (error) {
        console.error("Inquiry persistence error:", error);
        return Response.json({ ok: false, error: "formErrorGeneric" }, { status: 500 });
    }

    return Response.json({ ok: true, sessionRef });
}