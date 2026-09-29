const SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )zaad_preferred_language=([^;]+)/);var lang=m?decodeURIComponent(m[1]):localStorage.getItem("zaad_preferred_language");if(lang!=="fa")return;["Regular","Light","Bold"].forEach(function(weight){var link=document.createElement("link");link.rel="preload";link.as="font";link.type="font/otf";link.crossOrigin="anonymous";link.href="/fonts/Dorsa-"+weight+".otf";document.head.appendChild(link);});}catch(e){}})();`;

export default function DorsaPreloadScript() {
    return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
