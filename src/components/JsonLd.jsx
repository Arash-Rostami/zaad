export default function JsonLd({ schemas = [] }) {
    const safe = schemas.filter(Boolean);
    if (!safe.length) return null;

    return (
        <>
            {safe.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </>
    );
}