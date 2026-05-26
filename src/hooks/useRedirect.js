import { useEffect } from "react";

export default function useRedirect(condition, targetUrl, openInNewTab = false) {
    useEffect(() => {
        if (condition && targetUrl) {
            if (openInNewTab) {
                window.open(targetUrl, "_blank", "noopener,noreferrer");
            } else {
                window.location.href = targetUrl;
            }
        }
    }, [condition, targetUrl, openInNewTab]);
}