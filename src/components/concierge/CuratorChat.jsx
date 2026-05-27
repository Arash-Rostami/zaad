import React from "react";
import { motion } from "motion/react";
import { Send, Sparkles } from "lucide-react";
import MaisonReveal from "../MaisonReveal";

export default function CuratorChat({ concierge, t }) {
    const {
        chatMessages,
        userQuery, setUserQuery,
        chatLoading,
        scrollRef,
        handleSendMessage,
    } = concierge;

    return (
        <MaisonReveal
            variant="scale-down-unveil"
            delay={0.3}
            className="lg:col-span-6 flex flex-col h-[520px] text-left rtl:text-right"
        >
            <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-4">
                <h3 className="text-xl md:text-2xl font-serif text-ink font-light flex items-center tracking-tight justify-start">
                    <Sparkles className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3 text-accent shrink-0" />
                    {t("zaadDigitalCurator")}
                </h3>
                <span className="text-[9px] font-mono text-ink tracking-widest bg-panel border border-ink/10 px-3 py-1 uppercase rounded-full">
                    Gemini 2.5 Flash
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none mb-4 bg-surface-overlay p-4 border border-ink/10 rounded-2xl">
                {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[85%] p-4 text-xs font-light leading-relaxed shadow-sm ${
                            msg.role === "user"
                                ? "bg-ink text-canvas font-normal rounded-2xl rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none"
                                : "bg-panel text-ink border border-ink/10 rounded-2xl rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none"
                        }`}>
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                        <span className="text-[8px] font-mono text-muted/70 mt-1 uppercase tracking-widest">
                            {msg.role === "user" ? t("chatClient") : t("chatCurator")} • {msg.timestamp}
                        </span>
                    </div>
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

            <form onSubmit={handleSendMessage} className="flex space-x-2 rtl:space-x-reverse">
                <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    disabled={chatLoading}
                    placeholder={t("chatPlaceholder")}
                    className="flex-1 bg-panel border border-ink/10 px-5 py-3 text-xs focus:border-ink focus:outline-none placeholder-dim-faint transition-colors rounded-full font-sans disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={chatLoading || !userQuery.trim()}
                    className="bg-ink text-canvas border border-ink w-12 h-12 rounded-full hover:bg-transparent hover:text-ink transition-all flex items-center justify-center disabled:opacity-30 disabled:hover:bg-ink disabled:hover:text-canvas shrink-0 cursor-pointer"
                >
                    <Send className="w-4 h-4 text-canvas" />
                </button>
            </form>
        </MaisonReveal>
    );
}
