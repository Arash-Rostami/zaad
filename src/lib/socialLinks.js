import { Instagram, Linkedin, MessageCircle, Send } from "lucide-react";


const SOCIAL_LINKS = Object.freeze([
    Object.freeze({
        id: "instagram",
        href: "https://instagram.com/zaaddesignofficial",
        icon: Instagram,
        labelKey: "footerSocialInstagram",
    }),
    Object.freeze({
        id: "linkedin",
        href: "https://linkedin.com/company/zaad_placeholder",
        icon: Linkedin,
        labelKey: "footerSocialLinkedin",
        disabled: true,
    }),
    Object.freeze({
        id: "telegram",
        href: "https://t.me/zaad_placeholder",
        icon: Send,
        labelKey: "footerSocialTelegram",
        disabled: true,
    }),
    Object.freeze({
        id: "whatsapp",
        href: "https://wa.me/zaad_placeholder",
        icon: MessageCircle,
        labelKey: "footerSocialWhatsapp",
        disabled: true,
    }),
]);

export default SOCIAL_LINKS;
