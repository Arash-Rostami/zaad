import { Instagram, Linkedin, MessageCircle, Send } from "lucide-react";


const SOCIAL_LINKS = Object.freeze([
    Object.freeze({
        id: "instagram",
        href: "https://instagram.com/zaad_placeholder",
        icon: Instagram,
        labelKey: "footerSocialInstagram",
    }),
    Object.freeze({
        id: "linkedin",
        href: "https://linkedin.com/company/zaad_placeholder",
        icon: Linkedin,
        labelKey: "footerSocialLinkedin",
    }),
    Object.freeze({
        id: "telegram",
        href: "https://t.me/zaad_placeholder",
        icon: Send,
        labelKey: "footerSocialTelegram",
    }),
    Object.freeze({
        id: "whatsapp",
        href: "https://wa.me/zaad_placeholder",
        icon: MessageCircle,
        labelKey: "footerSocialWhatsapp",
    }),
]);

export default SOCIAL_LINKS;
