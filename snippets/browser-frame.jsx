export const BrowserFrame = ({ src, url = "app.whatsmark.io", alt = "", caption }) => (
  <div style={{ margin: "1.5rem 0" }}>
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(128,128,128,0.25)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        background: "rgba(128,128,128,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 14px",
          borderBottom: "1px solid rgba(128,128,128,0.2)",
        }}
      >
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FF5F57" }} />
          <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FEBC2E" }} />
          <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#28C840" }} />
        </div>

        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: "12px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            color: "rgba(128,128,128,1)",
            background: "rgba(128,128,128,0.12)",
            borderRadius: "6px",
            padding: "4px 12px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {url}
        </div>

        <div style={{ width: "45px", flexShrink: 0 }} />
      </div>

      <img src={src} alt={alt} style={{ display: "block", width: "100%", margin: 0 }} />
    </div>

    {caption && (
      <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(128,128,128,1)", marginTop: "0.75rem" }}>
        {caption}
      </p>
    )}
  </div>
);
