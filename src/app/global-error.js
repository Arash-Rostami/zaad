"use client";

export default function GlobalError({ reset }) {
    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#F4F1ED",
                    color: "#1C1C1C",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    textAlign: "center",
                    padding: "24px",
                }}
            >
                <div style={{ maxWidth: 480 }}>
                    <p
                        style={{
                            fontSize: 11,
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: "#8C7355",
                            marginBottom: 20,
                            fontFamily: "monospace",
                        }}
                    >
                        ZAAD
                    </p>
                    <h1 style={{ fontSize: 32, fontWeight: 300, margin: "0 0 16px" }}>
                        Something Interrupted This Page
                    </h1>
                    <p style={{ fontSize: 15, color: "#5C5954", lineHeight: 1.7, margin: "0 0 32px" }}>
                        Our atelier has been notified. Please try again, or return to the showroom.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            border: "1px solid rgba(28,28,28,0.2)",
                            borderRadius: 999,
                            padding: "14px 32px",
                            fontSize: 11,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            background: "transparent",
                            color: "#1C1C1C",
                            cursor: "pointer",
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
