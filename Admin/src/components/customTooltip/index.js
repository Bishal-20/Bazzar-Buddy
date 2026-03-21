const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;

    return (
      <div
        style={{
          background: "rgba(0,0,0,0.7)",
          padding: "6px 8px",
          borderRadius: "6px",
          color: "#fff",
          fontSize: "12px",
          lineHeight: "1.2",
        }}
      >
        <div style={{ fontSize: "10px", opacity: 0.8 }}>{label}</div>
        <div style={{ fontWeight: "bold" }}>₹ {value}</div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;