export const Figure = ({ src, alt = "", caption }) => (
  <div style={{ margin: "1.5rem 0" }}>
    <img src={src} alt={alt} style={{ display: "block", maxWidth: "100%", height: "auto", margin: 0 }} />
    {caption && (
      <p style={{ textAlign: "left", fontSize: "14px", color: "rgba(128,128,128,1)", marginTop: "0.75rem" }}>
        {caption}
      </p>
    )}
  </div>
);

export const BrowserFrame = ({ src, alt = "", caption, maxWidth }) => (
  <div style={{ margin: "1.5rem 0" }}>
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(128,128,128,0.25)",
        background: "rgba(128,128,128,0.06)",
        maxWidth,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "8px 10px",
          borderBottom: "1px solid rgba(128,128,128,0.2)",
        }}
      >
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FF5F57" }} />
          <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FEBC2E" }} />
          <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#28C840" }} />
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
