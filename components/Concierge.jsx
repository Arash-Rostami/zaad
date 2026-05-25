"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, Calendar, Check, Clock } from "lucide-react";
import MaisonButton from "./MaisonButton";
import MaisonReveal from "./MaisonReveal";
import { useLanguage } from "../lib/TranslationService";
export default function Concierge({ preselectedItem, onClearPreselected }) {
  const { isFarsi, language, getItemTranslations } = useLanguage();

  // Inquiry form states
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [desiredConsultation, setDesiredConsultation] = useState("acquisition");
  const [additionalNote, setAdditionalNote] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Chat/Curator states
  const [chatMessages, setChatMessages] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef(null);

  // Initialize welcome message dynamically on language load
  useEffect(() => {
    setChatMessages([
      {
        id: "curator-welcome",
        role: "assistant",
        content: isFarsi
          ? "به بخش مشاوره و سفارش اختصاصی کارگاه زاد خوش آمدید. من کارشناس گالری هوشمند شما هستم. چنانچه در حال طراحی داخلی یک فضای معمارانه هستید، جزییات، نور و ساختار محیط خود را بنویسید تا آثار متناسب، سنگ‌های هماهنگ و چیدمان‌های ماندگار را به شما پیشنهاد دهم."
          : "Welcome to ZAAD's Private Consultation. I am your Digital Curator. If you are designing or completing an architectural space, describe its qualities, lighting, and layout, and I will recommend specific material compositions or objects from our vault.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }, [language]);

  // Pre-populate when an item is selected for inquiry
  useEffect(() => {
    if (preselectedItem) {
      setDesiredConsultation("acquisition");
      const name =
        getItemTranslations(preselectedItem.id)?.name || preselectedItem.name;
      const number = preselectedItem.number;
      setAdditionalNote(
        isFarsi
          ? `من مایل به تملک اثر ${name} (${number}) برای فضای خود هستم. لطفا موجودی مادی فعلی و زمان تحویل آن را بفرمایید.`
          : `I am looking to acquire the ${preselectedItem.name} (${preselectedItem.number}) for my space. Please provide current physical availability and white-glove shipping timeline.`,
      );
      const inquiryMessage = {
        id: `user-query-${Date.now()}`,
        role: "user",
        content: isFarsi
          ? `من به تملک اثر ${name} علاقه‌مندم. ممکن است درباره سنگ تشکیل‌دهنده و چیدمان بهینه آن بگویید؟`
          : `I am interested in acquiring the ${preselectedItem.name}. Can you tell me more about its materials and how to style it in a room?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, inquiryMessage]);
      triggerCuratorResponse([...chatMessages, inquiryMessage]);
      onClearPreselected(); // Reset parent item context
    }
  }, [preselectedItem, language]);

  // Keep chat scrolled
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current.parentElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [chatMessages, chatLoading]);

  // Form submit callback
  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;
    setFormSubmitted(true);
  };

  // AI chat trigger
  const triggerCuratorResponse = async (history) => {
    setChatLoading(true);
    try {
      const payload = history.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Pass language context to model prompt in backend proxy
      const res = await fetch("/api/curate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: payload,
          language: language,
        }),
      });
      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          id: `curator-reply-${Date.now()}`,
          role: "assistant",
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (err) {
      console.error("AI Curator error:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `curator-reply-error-${Date.now()}`,
          role: "assistant",
          content: isFarsi
            ? "خطایی در دریافت پیام بوجود آمده است. لطفا مشخصات تماس خود را در کارت قرار ملاقات کناری مکتوب فرمایید تا مدیران آتلیه فلورانس مستقیما با کارشناس معمار شما ارتباط برقرار کنند."
            : "The digital curator's transmission is temporarily interrupted. Please fill out our Private Inquiry card to coordinate directly with our Florence team.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userQuery.trim() || chatLoading) return;
    const userMsg = {
      id: `user-query-${Date.now()}`,
      role: "user",
      content: userQuery,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setUserQuery("");
    triggerCuratorResponse(updatedHistory);
  };
  return (
    <section
      id="concierge"
      className="py-24 md:py-36 bg-[#F4F1ED] px-6 sm:px-12 border-b border-[#1C1C1C]/10 relative"
    >
      <div className="max-w-7xl mx-auto">
        <MaisonReveal variant="unveil" threshold={0.05}>
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-[#8E7A62] font-semibold uppercase block mb-3">
              {isFarsi
                ? "تدارکات سفارش و خدمات انحصاری"
                : "ACQUISITIONS & SERVICES"}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#1C1C1C] tracking-tight font-light mb-4">
              {isFarsi ? "سفارشات خصوصی و تملک آثار" : "Private Commissions"}
            </h2>
            <p className="text-sm md:text-base text-[#5C5954] font-light leading-relaxed">
              {isFarsi
                ? "تمامی آثار به صورت منحصر به فرد و مجزا با توجه به ابعاد پروژه شما حجاری می‌شوند. فرآیند تدارکات را آغاز کنید، قرار ملاقات بازدید حضوری در فلورانس بگذارید یا جزئیات مقتضی معمار ساختمان خود را مکتوب نمایید."
                : "Every piece is made individually upon commission. Initiate an acquisition, schedule a private studio visit in Florence, or request architectural design consultations."}
            </p>
          </div>
        </MaisonReveal>

        {/* Dynamic Dual columns: Left is Concierge Form, Right is the Live Digital Curator Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-18 relative">
          {/* Column A: Custom Client Form */}
          <MaisonReveal
            variant="slide-up-royal"
            delay={0.15}
            className="lg:col-span-6 border-b lg:border-b-0 lg:border-r lg:rtl:border-r-0 lg:rtl:border-l border-[#1C1C1C]/10 pb-12 lg:pb-0 lg:pr-12 lg:rtl:pr-0 lg:rtl:pl-12 text-left rtl:text-right"
          >
            <h3 className="text-xl md:text-2xl font-serif text-[#1C1C1C] font-light mb-8 flex items-center justify-start tracking-tight">
              <Calendar className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 text-[#8E7A62] shrink-0" />
              {isFarsi
                ? "کارت رزرو و تماس تدارکات اثر"
                : "Acquisition & Booking Card"}
            </h3>

            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  onSubmit={handleInquirySubmit}
                  initial={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[9px] font-mono tracking-widest text-[#5C5954] uppercase block mb-1.5 font-medium">
                        {isFarsi
                          ? "نام و نام خانوادگی خریدار *"
                          : "Bespoke Client Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder={
                          isFarsi ? "مثال: علی رضایی" : "e.g. Eleanor Vance"
                        }
                        className="w-full bg-white border border-[#1C1C1C]/15 px-4 py-3 text-xs focus:border-[#1C1C1C] focus:outline-none placeholder-[#9C9588]/60 transition-colors rounded-xl font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono tracking-widest text-[#5C5954] uppercase block mb-1.5 font-medium">
                        {isFarsi
                          ? "پست الکترونیکی مطمئن *"
                          : "Secure Contact Email *"}
                      </label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="client@atelier.com"
                        className="w-full bg-white border border-[#1C1C1C]/15 px-4 py-3 text-xs focus:border-[#1C1C1C]/80 focus:outline-none placeholder-[#9C9588]/60 transition-colors rounded-xl font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[9px] font-mono tracking-widest text-[#5C5954] uppercase block mb-1.5 font-medium">
                        {isFarsi
                          ? "تلفن تماس مستقیم (اختیاری)"
                          : "Direct Telephone (Optional)"}
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+98 912 345 6789"
                        className="w-full bg-white border border-[#1C1C1C]/15 px-4 py-3 text-xs focus:border-[#1C1C1C] focus:outline-none placeholder-[#9C9588]/60 transition-colors rounded-xl font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono tracking-widest text-[#5C5954] uppercase block mb-1.5 font-medium">
                        {isFarsi
                          ? "دسته درخواست مشاوره"
                          : "Consultation Category"}
                      </label>
                      <select
                        value={desiredConsultation}
                        onChange={(e) => setDesiredConsultation(e.target.value)}
                        className="w-full bg-white border border-[#1C1C1C]/15 px-4 py-3 text-xs focus:border-[#1C1C1C] focus:outline-none transition-colors rounded-xl block font-sans"
                      >
                        <option value="acquisition">
                          {isFarsi
                            ? "تملک و خرید اثر آرشیو خصوصی"
                            : "Private Archive Acquisition"}
                        </option>
                        <option value="interior">
                          {isFarsi
                            ? "طراحی سیستم و پروژه‌های مسکونی"
                            : "Residential Consultation ($25k fee)"}
                        </option>
                        <option value="visit">
                          {isFarsi
                            ? "هماهنگی بازدید آتلیه فلورانس"
                            : "Florence Atelier Private Viewing"}
                        </option>
                        <option value="material">
                          {isFarsi
                            ? "سفارش ابعاد و مواد سنگ‌های خام"
                            : "Custom Material Composition Spec"}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono tracking-widest text-[#5C5954] uppercase block mb-1.5 font-medium">
                      {isFarsi
                        ? "اطلاعات تکمیلی فضا و نقشه‌های معمار"
                        : "Archival Architect Specs & Space Detail"}
                    </label>
                    <textarea
                      rows={4}
                      value={additionalNote}
                      onChange={(e) => setAdditionalNote(e.target.value)}
                      placeholder={
                        isFarsi
                          ? "الگوهای نوری، جهت‌های قرارگیری، ابعاد مورد نیاز و شماره اثر مورد نظر خود را ذکر فرمایید..."
                          : "Describe lighting patterns, raw finishes, spatial orientations or specific object numbering requests."
                      }
                      className="w-full bg-white border border-[#1C1C1C]/15 px-4 py-3 text-xs focus:border-[#1C1C1C] focus:outline-none placeholder-[#9C9588]/60 transition-colors rounded-xl resize-none font-sans"
                    ></textarea>
                  </div>

                  <MaisonButton
                    type="submit"
                    variant="solid"
                    className="w-full font-sans"
                  >
                    {isFarsi
                      ? "ثبت نهایی درخواست رزرو امن"
                      : "Submit Secure Inquiry"}
                  </MaisonButton>

                  <div className="p-4 bg-[#E8E4DF]/60 border border-[#1C1C1C]/10 text-[10px] font-mono text-[#5C5954] space-y-2 rounded-xl">
                    <p className="flex items-center">
                      <Clock className="w-3 h-3 text-[#8E7A62] mr-2 rtl:mr-0 rtl:ml-2 shrink-0" />
                      <span>
                        {isFarsi
                          ? "زمان استاندارد پاسخگویی: بررسی و تایید ظرف ۴ الی ۶ ساعت اداری."
                          : "Studio Reply Standard: Insured within 4-6 business hours."}
                      </span>
                    </p>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="bg-white/95 backdrop-blur-sm p-8 border border-[#1C1C1C]/10 text-center rounded-2xl shadow-xl font-sans"
                >
                  <div className="w-12 h-12 rounded-full border border-[#1C1C1C]/10 flex items-center justify-center mx-auto mb-6 bg-[#F4F1ED]">
                    <Check className="w-5 h-5 text-[#8E7A62]" />
                  </div>
                  <h4 className="font-serif text-xl font-light text-[#1C1C1C] mb-2">
                    {isFarsi ? "سند رزرو ثبت گردید" : "Committed to Archive"}
                  </h4>
                  <p className="text-xs text-[#5C5954] leading-relaxed max-w-sm mx-auto mb-6">
                    {isFarsi
                      ? `${clientName} عزیز، اطلاعات ثبت سفارش شما با موفقیت در سیستم مرکزی کارگاه فلورانس ثبت گردید. مدیر طراحی ارشد آتلیه به زودی طی ۴ ساعت آینده با شما تماس خواهد گرفت.`
                      : `${clientName}, your secure consultation card has been committed to our Florence studio log. A dedicated design director will reach out directly to your coordinate email within 4 hours.`}
                  </p>
                  <div className="border-t border-[#1C1C1C]/10 pt-4 font-mono text-[9px] text-[#8E7A62] tracking-widest uppercase">
                    {isFarsi ? "سند ارجاع" : "SESSION REF"}: SEC-COM-
                    {Math.floor(Math.random() * 90000) + 10000}
                  </div>
                  <MaisonButton
                    variant="ghost"
                    onClick={() => {
                      setFormSubmitted(false);
                      setClientName("");
                      setClientEmail("");
                      setClientPhone("");
                      setAdditionalNote("");
                    }}
                    className="mt-6 text-xs text-[#1C1C1C] cursor-pointer"
                  >
                    {isFarsi
                      ? "ثبت درخواست رزرو جدید"
                      : "Inquire for Another Object"}
                  </MaisonButton>
                </motion.div>
              )}
            </AnimatePresence>
          </MaisonReveal>

          {/* Column B: Live AI Assistant Curator Chat */}
          <MaisonReveal
            variant="scale-down-unveil"
            delay={0.3}
            className="lg:col-span-6 flex flex-col h-[520px] text-left rtl:text-right"
          >
            <div className="flex items-center justify-between border-b border-[#1C1C1C]/10 pb-4 mb-4">
              <h3 className="text-xl md:text-2xl font-serif text-[#1C1C1C] font-light flex items-center tracking-tight justify-start">
                <Sparkles className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 text-[#8E7A62] shrink-0" />
                {isFarsi
                  ? "کارشناس و مشاور دیجیتال زاد"
                  : "ZAAD Digital Curator"}
              </h3>
              <span className="text-[9px] font-mono text-[#1C1C1C] tracking-widest bg-white border border-[#1C1C1C]/10 px-3 py-1 uppercase rounded-full">
                Gemini 2.5 Flash
              </span>
            </div>

            {/* Chat Messages container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none mb-4 bg-[#E8E4DF]/40 p-4 border border-[#1C1C1C]/10 rounded-2xl">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 text-xs font-light leading-relaxed shadow-sm ${msg.role === "user" ? "bg-[#1C1C1C] text-white font-normal rounded-2xl rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none" : "bg-white text-[#1C1C1C] border border-[#1C1C1C]/10 rounded-2xl rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none"}`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  <span className="text-[8px] font-mono text-[#5C5954]/70 mt-1 uppercase tracking-widest">
                    {msg.role === "user"
                      ? isFarsi
                        ? "خریدار"
                        : "CLIENT"
                      : isFarsi
                        ? "مشاور آتلیه"
                        : "CURATOR"}{" "}
                    • {msg.timestamp}
                  </span>
                </div>
              ))}

              {chatLoading && (
                <div className="flex flex-col items-start">
                  <div className="bg-white text-[#1C1C1C]/70 border border-[#1C1C1C]/10 max-w-[85%] p-4 text-xs font-mono tracking-wider animate-pulse rounded-full">
                    {isFarsi
                      ? "در حال تحلیل پارامترهای چینش معماری..."
                      : "Analyzing composition parameters..."}
                  </div>
                </div>
              )}
              <div
                ref={scrollRef}
                style={{
                  float: "left",
                  clear: "both",
                }}
              />
            </div>

            {/* Input form */}
            <form
              onSubmit={handleSendMessage}
              className="flex space-x-2 rtl:space-x-reverse"
            >
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                disabled={chatLoading}
                placeholder={
                  isFarsi
                    ? "درباره سنگ تراورتن، چیدمان بهینه یا نور اتاق سوال کنید..."
                    : "Ask about travertine pairings, room spacing, or materials..."
                }
                className="flex-1 bg-white border border-[#1C1C1C]/10 px-5 py-3 text-xs focus:border-[#1C1C1C] focus:outline-none placeholder-[#9C9588]/60 transition-colors rounded-full font-sans disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={chatLoading || !userQuery.trim()}
                className="bg-[#1C1C1C] text-white border border-[#1C1C1C] w-12 h-12 rounded-full hover:bg-transparent hover:text-[#1C1C1C] transition-all flex items-center justify-center disabled:opacity-30 disabled:hover:bg-[#1C1C1C] disabled:hover:text-white shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </MaisonReveal>
        </div>
      </div>
    </section>
  );
}
