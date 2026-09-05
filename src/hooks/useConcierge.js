import { useState, useEffect, useRef, useCallback } from "react";
import { getPreference } from "@/services/PreferenceService";

const SUBMIT_INQUIRY_RE = /\[\[SUBMIT_INQUIRY\]\]\s*([\s\S]*?)\s*\[\[\/SUBMIT_INQUIRY\]\]/;

export default function useConcierge({ language, preselectedItem, onClearPreselected, t }) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [desiredConsultation, setDesiredConsultation] = useState("acquisition");
  const [additionalNote, setAdditionalNote] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [sessionRef, setSessionRef] = useState(null);
  const [appointmentMode, setAppointmentMode] = useState("call");
  const [appointmentWindow, setAppointmentWindow] = useState("");
  const userTouchedMode = useRef(false);
  const handledPreselectRef = useRef(null);
  const preselectedItemRef = useRef(preselectedItem);
  preselectedItemRef.current = preselectedItem;

  const buildWelcomeContent = () => {
    const lastViewedItem = !preselectedItemRef.current ? getPreference("lastViewedItem") : null;
    return lastViewedItem
        ? t("curatorWelcomeWithItem").replace("{name}", lastViewedItem.name)
        : t("curatorWelcome");
  };

  const [chatMessages, setChatMessages] = useState(() => [
    {
      id: "curator-welcome",
      role: "assistant",
      content: t("curatorWelcome"),
      timestamp: "",
    },
  ]);
  const [userQuery, setUserQuery] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setChatMessages([
      {
        id: "curator-welcome",
        role: "assistant",
        content: buildWelcomeContent(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [language, t]);

  const submitChatInquiry = useCallback(
      async (fields) => {
        try {
          const res = await fetch("/api/inquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clientName: fields.clientName,
              clientEmail: fields.clientEmail,
              clientPhone: fields.clientPhone,
              additionalNote: fields.additionalNote,
              language,
              source: "chat",
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.ok) return null;
          return data.sessionRef;
        } catch (err) {
          console.error("Chat inquiry submission error:", err);
          return null;
        }
      },
      [language]
  );

  const resolveCuratorReply = useCallback(
      async (rawText) => {
        const match = SUBMIT_INQUIRY_RE.exec(rawText);
        if (!match) return rawText;

        const cleanedText = rawText.replace(SUBMIT_INQUIRY_RE, "").trim();
        const jsonText = match[1].trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
        let fields;
        try {
          fields = JSON.parse(jsonText);
        } catch (err) {
          console.error("Malformed SUBMIT_INQUIRY block:", err);
          return `${cleanedText}\n\n${t("curatorSubmitFailed")}`;
        }

        if (!fields?.clientName || !fields?.clientPhone) return cleanedText;

        const sessionRef = await submitChatInquiry(fields);
        return sessionRef
            ? `${cleanedText}\n\n${t("sessionRef")}: #${sessionRef}`
            : `${cleanedText}\n\n${t("curatorSubmitFailed")}`;
      },
      [t, submitChatInquiry]
  );

  const triggerCuratorResponse = useCallback(
      async (history) => {
        setChatLoading(true);
        try {
          const payload = history
              .filter((m) => m.id !== "curator-welcome")
              .map((m) => ({ role: m.role, content: m.content }));
          const res = await fetch("/api/curate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: payload, language }),
          });
          if (!res.ok) throw new Error("API call failed");
          const data = await res.json();
          const content = await resolveCuratorReply(data.text ?? "");
          setChatMessages((prev) => [
            ...prev,
            {
              id: `curator-reply-${Date.now()}`,
              role: "assistant",
              content,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        } catch (err) {
          console.error("AI Curator error:", err);
          setChatMessages((prev) => [
            ...prev,
            {
              id: `curator-reply-error-${Date.now()}`,
              role: "assistant",
              content: t("curatorError"),
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        } finally {
          setChatLoading(false);
        }
      },
      [language, resolveCuratorReply, t]
  );

  useEffect(() => {
    if (!preselectedItem) {
      handledPreselectRef.current = null;
      return;
    }
    if (handledPreselectRef.current === preselectedItem) return;
    handledPreselectRef.current = preselectedItem;
    setDesiredConsultation("acquisition");
    const name = preselectedItem.name;
    const number = preselectedItem.number;
    setAdditionalNote(
        language === "fa"
            ? `من مایل به تملک اثر ${name} (${number}) برای فضای خود هستم. لطفا موجودی مادی فعلی و زمان تحویل آن را بفرمایید.`
            : `I am looking to acquire the ${preselectedItem.name} (${preselectedItem.number}) for my space. Please provide current physical availability and white-glove shipping timeline.`
    );
    const inquiryMessage = {
      id: `user-query-${Date.now()}`,
      role: "user",
      content:
          language === "fa"
              ? `من به تملک اثر ${name} علاقه‌مندم. ممکن است درباره سنگ تشکیل‌دهنده و چیدمان بهینه آن بگویید؟`
              : `I am interested in acquiring the ${preselectedItem.name}. Can you tell me more about its materials and how to style it in a room?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updatedHistory = [...chatMessages, inquiryMessage];
    setChatMessages(updatedHistory);
    triggerCuratorResponse(updatedHistory);
    onClearPreselected();
  }, [preselectedItem, language]);

  useEffect(() => {
    if (userTouchedMode.current) return;
    setAppointmentMode(desiredConsultation === "visit" ? "audience" : "call");
  }, [desiredConsultation]);

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current.parentElement;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
  }, [chatMessages, chatLoading]);

  const selectAppointmentMode = useCallback((mode) => {
    userTouchedMode.current = true;
    setAppointmentMode(mode);
  }, []);

  const resetAppointment = useCallback(() => {
    userTouchedMode.current = false;
    setAppointmentWindow("");
    setAppointmentMode(desiredConsultation === "visit" ? "audience" : "call");
  }, [desiredConsultation]);

  const handleInquirySubmit = useCallback(
      async (e) => {
        e.preventDefault();
        if (formSubmitting) return;

        setFormSubmitting(true);
        setFormErrors({});

        try {
          const res = await fetch("/api/inquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clientName,
              clientEmail,
              clientPhone,
              desiredConsultation,
              additionalNote,
              appointmentMode,
              appointmentWindow,
              language,
            }),
          });
          const data = await res.json();

          if (!res.ok || !data.ok) {
            const FIELDS_WITH_UI = new Set(["clientName", "clientEmail", "clientPhone", "additionalNote", "appointmentWindow"]);
            const hasVisibleError = data.errors && Object.keys(data.errors).some((key) => FIELDS_WITH_UI.has(key));
            if (hasVisibleError) setFormErrors(data.errors);
            else setFormErrors({ form: data.error || "formErrorGeneric" });
            return;
          }

          setSessionRef(data.sessionRef);
          setFormSubmitted(true);
        } catch (err) {
          console.error("Inquiry submission error:", err);
          setFormErrors({ form: "formErrorGeneric" });
        } finally {
          setFormSubmitting(false);
        }
      },
      [
        formSubmitting,
        clientName,
        clientEmail,
        clientPhone,
        desiredConsultation,
        additionalNote,
        appointmentMode,
        appointmentWindow,
        language,
      ]
  );

  const handleSendMessage = useCallback(
      (e) => {
        e.preventDefault();
        if (!userQuery.trim() || chatLoading) return;
        const userMsg = {
          id: `user-query-${Date.now()}`,
          role: "user",
          content: userQuery,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        const updatedHistory = [...chatMessages, userMsg];
        setChatMessages(updatedHistory);
        setUserQuery("");
        triggerCuratorResponse(updatedHistory);
      },
      [userQuery, chatLoading, chatMessages, triggerCuratorResponse]
  );

  return {
    clientName, setClientName,
    clientEmail, setClientEmail,
    clientPhone, setClientPhone,
    desiredConsultation, setDesiredConsultation,
    additionalNote, setAdditionalNote,
    formSubmitted, setFormSubmitted,
    formSubmitting,
    formErrors, setFormErrors,
    sessionRef,
    appointmentMode, selectAppointmentMode,
    appointmentWindow, setAppointmentWindow,
    resetAppointment,
    chatMessages,
    userQuery, setUserQuery,
    chatLoading,
    scrollRef,
    handleInquirySubmit,
    handleSendMessage,
  };
}