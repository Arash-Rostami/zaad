export default function JsonLd({ schemas = [] }) {
    const safe = schemas.filter(Boolean);
    if (!safe.length) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(safe) }}
        />
    );
}