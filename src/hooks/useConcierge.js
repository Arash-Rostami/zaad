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

  const buildWelcomeContent = useCallback(() => {
    const lastViewedItem = !preselectedItemRef.current ? getPreference("lastViewedItem") : null;
    return lastViewedItem
        ? t("curatorWelcomeWithItem").replace("{name}", lastViewedItem.name)
        : t("curatorWelcome");
  }, [t]);

  const [chatMessages, setChatMessages] = useState(() => [
    {
      id: "curator-welcome",
      role: "assistant",
      content: t("curatorWelcome"),
      timestamp: "",
    },
  ]);
  const chatMessagesRef = useRef(chatMessages);
  chatMessagesRef.current = chatMessages;
  const [userQuery, setUserQuery] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatLoadingSlow, setChatLoadingSlow] = useState(false);
  const scrollRef = useRef(null);
  const requestInFlightRef = useRef(false);
  const nearBottomRef = useRef(true);

  useEffect(() => {
    if (requestInFlightRef.current) return;
    setChatMessages([
      {
        id: "curator-welcome",
        role: "assistant",
        content: buildWelcomeContent(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [language, buildWelcomeContent]);

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
        if (requestInFlightRef.current) return;
        requestInFlightRef.current = true;
        setChatLoading(true);
        const slowTimer = window.setTimeout(() => setChatLoadingSlow(true), 9000);
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
          const rawContent = await resolveCuratorReply(data.text ?? "");
          const isEmpty = !rawContent.trim();
          setChatMessages((prev) => [
            ...prev,
            {
              id: `curator-reply-${Date.now()}`,
              role: "assistant",
              content: isEmpty ? t("curatorError") : rawContent,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isError: isEmpty,
            },
          ]);
        } catch (err) {
          console.error("AI Curator error:", err);
          const offline = typeof navigator !== "undefined" && navigator.onLine === false;
          setChatMessages((prev) => [
            ...prev,
            {
              id: `curator-reply-error-${Date.now()}`,
              role: "assistant",
              content: offline ? t("curatorOffline") : t("curatorError"),
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isError: true,
            },
          ]);
        } finally {
          window.clearTimeout(slowTimer);
          setChatLoadingSlow(false);
          requestInFlightRef.current = false;
          setChatLoading(false);
        }
      },
      [language, resolveCuratorReply, t]
  );

  const retryLastExchange = useCallback(() => {
    const current = chatMessagesRef.current;
    const last = current[current.length - 1];
    if (!last?.isError) return;
    const withoutError = current.slice(0, -1);
    setChatMessages(withoutError);
    triggerCuratorResponse(withoutError);
  }, [triggerCuratorResponse]);

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
            ? `دوست دارم اثر ${name} (${number}) رو برای فضای خودم داشته باشم. لطفاً موجودی فعلی و زمان تحویلش رو بفرمایید.`
            : `I am looking to acquire the ${preselectedItem.name} (${preselectedItem.number}) for my space. Please provide current physical availability and white-glove shipping timeline.`
    );
    const inquiryMessage = {
      id: `user-query-${Date.now()}`,
      role: "user",
      content:
          language === "fa"
              ? `به اثر ${name} علاقه‌مندم. می‌شه درباره جنس سنگش و بهترین حالت چیدمانش برام بگید؟`
              : `I am interested in acquiring the ${preselectedItem.name}. Can you tell me more about its materials and how to style it in a room?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updatedHistory = [...chatMessagesRef.current, inquiryMessage];
    setChatMessages(updatedHistory);
    triggerCuratorResponse(updatedHistory);
    onClearPreselected();
  }, [preselectedItem, language, onClearPreselected, triggerCuratorResponse]);

  useEffect(() => {
    if (userTouchedMode.current) return;
    setAppointmentMode(desiredConsultation === "visit" ? "audience" : "call");
  }, [desiredConsultation]);

  useEffect(() => {
    const container = scrollRef.current?.parentElement;
    if (!container) return;
    const handleScroll = () => {
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      nearBottomRef.current = distanceFromBottom < 120;
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!nearBottomRef.current) return;
    const container = scrollRef.current?.parentElement;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
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
        if (!userQuery.trim() || chatLoading || requestInFlightRef.current) return;
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
    chatLoadingSlow,
    scrollRef,
    handleInquirySubmit,
    handleSendMessage,
    retryLastExchange,
  };
}