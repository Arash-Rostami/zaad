import { useState, useEffect, useRef } from "react";

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
        content: t("curatorWelcome"),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [language, t]);

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

  const triggerCuratorResponse = async (history) => {
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
      setChatMessages((prev) => [
        ...prev,
        {
          id: `curator-reply-${Date.now()}`,
          role: "assistant",
          content: data.text,
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
  };

  const selectAppointmentMode = (mode) => {
    userTouchedMode.current = true;
    setAppointmentMode(mode);
  };

  const resetAppointment = () => {
    userTouchedMode.current = false;
    setAppointmentWindow("");
    setAppointmentMode(desiredConsultation === "visit" ? "audience" : "call");
  };

  const handleInquirySubmit = async (e) => {
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
  };

  const handleSendMessage = (e) => {
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
  };

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
