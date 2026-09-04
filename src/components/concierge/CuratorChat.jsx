import React, { memo, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { Download, Send, Sparkles } from "lucide-react";
import MaisonReveal from "../MaisonReveal";
import wrapBrandNames from "@/lib/wrapBrandNames";
import renderChatMarkdown from "@/lib/renderChatMarkdown";

const LIST_ITEM = /^\s*(?:([0-9۰-۹]+)[.۔)]|[-•])\s+(.*)$/;

function renderCuratorLine(line, isFarsi, key) {
    const match = line.match(LIST_ITEM);
    if (match) {
        const [, marker, rest] = match;
        return (
            <div key={key} className="flex items-baseline gap-2">
                <span className="text-accent font-mono shrink-0">{marker ? `${marker}.` : "–"}</span>
                <span className="rtl:text-justify">{renderChatMarkdown(rest, isFarsi)}</span>
            </div>
        );
    }
    return <div key={key} className="rtl:text-justify">{renderChatMarkdown(line, isFarsi)}</div>;
}

const ChatMessage = memo(function ChatMessage({ msg, isFarsi, t }) {
    const lines = useMemo(
        () => msg.content.split("\n").filter((line) => line.trim().length > 0),
        [msg.content],
    );

    const bubble = (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
        >
            <div className={`max-w-[85%] p-4 text-xs font-light leading-relaxed shadow-card-sm ${
                msg.role === "user"
                    ? "bg-ink text-on-indicator font-normal rounded-2xl rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none"
                    : "bg-panel text-ink border border-ink/10 rounded-2xl rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none"
            }`}>
                <div className="space-y-1.5">
                    {lines.map((line, i) => renderCuratorLine(line, isFarsi, i))}
                </div>
            </div>
            <span className="text-[length:max(9px,calc(8px*var(--zaad-font-scale)))] font-mono text-muted/70 mt-1 uppercase tracking-widest">
                {msg.role === "user" ? t("chatClient") : t("chatCurator")} • {msg.timestamp}
            </span>
        </motion.div>
    );

    if (msg.id !== "curator-welcome") return bubble;

    return <MaisonReveal variant="unveil" delay={4}>{bubble}</MaisonReveal>;
});

function CuratorChat({ concierge, t, language }) {
    const isFarsi = language === "fa";
    const {
        chatMessages,
        userQuery, setUserQuery,
        chatLoading,
        scrollRef,
        handleSendMessage,
    } = concierge;

    const curatorTitle = useMemo(() => wrapBrandNames(t("zaadDigitalCurator")), [t]);

    const handleQueryChange = useCallback((e) => setUserQuery(e.target.value), [setUserQuery]);

    const handleDownloadChat = useCallback(() => {
        const transcript = chatMessages
            .map((m) => `[${m.role === "user" ? t("chatClient") : t("chatCurator")} • ${m.timestamp}]\n${m.content}`)
            .join("\n\n");
        const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "zaad-digital-curator.txt";
        link.click();
        URL.revokeObjectURL(url);
    }, [chatMessages, t]);

    return (
        <MaisonReveal
            variant="scale-down-unveil"
            delay={0.75}
            className="lg:col-span-6 flex flex-col h-full min-h-[520px] text-left rtl:text-right"
        >
            <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-4">
                <h3 className="text-xl md:text-2xl font-serif text-ink font-light flex items-center tracking-tight justify-start">
                    <Sparkles className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 text-accent shrink-0" />
                    {curatorTitle}
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleDownloadChat}
                        disabled={chatMessages.length <= 1}
                        title={t("chatDownload")}
                        aria-label={t("chatDownload")}
                        data-touch-boost
                        className="cursor-pointer flex items-center justify-center h-7 w-7 rounded-md text-muted/70 hover:text-headline transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-30 disabled:pointer-events-none shrink-0"
                    >
                        <Download className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[length:max(9px,calc(9px*var(--zaad-font-scale)))] font-mono text-ink tracking-widest bg-panel border border-ink/10 px-3 py-1 rounded-full">
                        {t("curatorModelBadge")}
                    </span>
                </div>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-y-auto space-y-4 pe-2 scrollbar-none mb-4 bg-surface-overlay p-4 border border-ink/10 rounded-2xl">
                {chatMessages.map((msg) => (
                    <ChatMessage key={msg.id} msg={msg} isFarsi={isFarsi} t={t} />
                ))}

                {chatLoading && (
                    <div className="flex flex-col items-start">
                        <motion.div
                            animate={{ opacity: [0.4, 0.9, 0.4] }}
                            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                            className="bg-panel text-ink/70 border border-ink/10 max-w-[85%] p-4 text-xs font-mono tracking-wider rounded-full"
                        >
                            {t("analyzingParams")}
                        </motion.div>
                    </div>
                )}

                <div ref={scrollRef} style={{ float: "left", clear: "both" }} />
            </div>

            <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                    type="text"
                    value={userQuery}
                    onChange={handleQueryChange}
                    disabled={chatLoading}
                    placeholder={t("chatPlaceholder")}
                    className="flex-1 bg-panel border border-ink/10 px-5 py-3 text-base sm:text-sm focus:border-ink focus:outline-none placeholder-dim-faint transition-colors rounded-full font-sans disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={chatLoading || !userQuery.trim()}
                    className="bg-ink text-on-indicator border border-ink w-12 h-12 rounded-full hover:bg-transparent hover:text-ink transition-all flex items-center justify-center disabled:opacity-30 disabled:hover:bg-ink disabled:hover:text-on-indicator shrink-0 cursor-pointer"
                >
                    <Send className="w-4 h-4 translate-x-px -translate-y-px rtl:-scale-x-100" />
                </button>
            </form>
        </MaisonReveal>
    );
}

export default memo(CuratorChat);