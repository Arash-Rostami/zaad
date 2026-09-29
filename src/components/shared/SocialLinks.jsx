import React, { memo } from "react";
import { useLanguage } from "@/services/LanguageProvider";
import SOCIAL_LINKS from "@/lib/socialLinks";
import Tooltip from "./Tooltip";

const SocialLinks = memo(function SocialLinks({ className = "" }) {
    const { t } = useLanguage();

    return (
        <div className={`flex items-center gap-4 ${className}`}>
            {SOCIAL_LINKS.map(({ id, href, icon: Icon, labelKey, disabled }) => (
                <Tooltip key={id} label={t(labelKey)}>
                    {disabled ? (
                        <span
                            aria-disabled="true"
                            className="flex items-center justify-center h-7 w-7 -m-1 rounded-md text-canvas/25 cursor-not-allowed"
                        >
                            <Icon className="w-4 h-4" />
                        </span>
                    ) : (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t(labelKey)}
                            data-touch-boost
                            className="flex items-center justify-center h-7 w-7 -m-1 rounded-md text-canvas/50 hover:text-accent transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas"
                        >
                            <Icon className="w-4 h-4" />
                        </a>
                    )}
                </Tooltip>
            ))}
        </div>
    );
});

export default SocialLinks;
