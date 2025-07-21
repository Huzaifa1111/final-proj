module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Scan these files for class names
  ],
  theme: {
    extend: {
      letterSpacing: {
        widest: "0.25em", // Custom letter-spacing
      },
      colors: {
        cardBg: "#F3F4F6",
        btnBg: "#008080",
        inputBg: "#F5F5F5",
        customPlaceholder: "#B0BEC5",
        borderColor: "#008080",
        heading: "#008080",
        btnHover: "#40BFBF",
        inputHover: "#FF7F50",
        inputText: "#1A1A1A",
        muted: "#F3F4F6", // Used for slidebar background
      },
      fontFamily: {
        font: ["Poppins"],
        nastaliq: ["'Noto Nastaliq Urdu'", "serif"],
      },
      backgroundImage: {
        gradient: "linear-gradient(to right, #008080, #F3F4F6)",
      },
      spacing: {
        15: "15em", // Custom width for buttons
        5: "5em",   // Custom height for buttons
      },
      borderRadius: {
        full: "50%",
      },
      boxShadow: {
        custom:
          "inset 0px 1px 0px 0px rgba(255,255,255,0.4), inset 0px -4px 0px 0px rgba(0,0,0,0.2), 0px 0px 0px 4px rgba(255,255,255,0.2), 0px 0px 180px 0px #9917FF",
      },
      transitionTimingFunction: {
        "ease-450": "ease-in-out 450ms",
        "ease-800": "ease-in-out 800ms",
      },
      keyframes: {
        borderPulse: {
          "0%": { boxShadow: "0 0 0 0 rgba(0,255,0,0)" },
          "50%": { boxShadow: "0 0 0 10px rgba(0,255,0,0.7)" },
          "100%": { boxShadow: "0 0 0 0 rgba(0,255,0,0)" },
        },
        
       
      },
     
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        // Button component
        ".btn": {
          border: "none",
          width: "11em",
          height: "41px",
          borderRadius: "0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "#1C1A1C",
          cursor: "pointer",
          transition: "all 450ms ease-in-out",
        },
        ".btn:hover": {
          background: "linear-gradient(0deg, #008080, #008080)",
          boxShadow:
            "inset 0px 1px 0px 0px rgba(255,255,255,0.4), inset 0px -4px 0px 0px rgba(0,0,0,0.2), 0px 0px 0px 4px rgba(255,255,255,0.2), 0px 0px 180px 0px rgba(164,124,243,0.3)",
          transform: "translateY(-2px)",
        },
        ".btn .sparkle": {
          fill: "#AAAAAA",
          transition: "all 800ms ease",
        },
        ".btn:hover .sparkle": {
          fill: "#A47CF3",
          transform: "scale(1.2)",
        },
        ".btn .text": {
          fontWeight: "600",
          color: "#AAAAAA",
          fontSize: "medium",
        },
        // Input component
        ".input-custom": {
          width: "auto",
          height: "40px",
          lineHeight: "28px",
          padding: "0 1rem",
          paddingLeft: "2.5rem",
          border: "2px solid transparent",
          borderRadius: "8px",
          outline: "none",
          backgroundColor: "#F5F5F5",
          color: "#1A1A1A",
          transition: ".3s ease",
        },
        ".input-custom::placeholder": {
          color: "#B0BEC5",
        },
        ".input-custom:hover, .input-custom:focus": {
          outline: "none",
          borderColor: "rgba(234,76,137,0.4)",
          backgroundColor: "#fff",
          boxShadow: "0 0 0 4px rgb(234 76 137 / 10%)",
        },
        ".icon-custom": {
          position: "absolute",
          left: "1rem",
          fill: "#B0BEC5",
          width: "1rem",
          height: "1rem",
        },
        // Subcategory grid and label classes with divider line
        ".subcat-grid": {
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(2, 48px)",
          gap: "4px",
          backgroundColor: "#fff",
          borderRadius: "15px",
          overflow: "visible",
          "&::after": {
            content: '""',
            position: "absolute",
            left: "4px", // align with the grid gap
            right: "4px",
            top: "calc(48px + 2px)", // 48px for the first row + half the gap (2px)
            borderTop: "1px solid #ccc",
            zIndex: "3",
          },
        },
        ".subcat-label": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "1.5rem",
          fontWeight: "500",
          color: "#008080",
          backgroundColor: "transparent",
          width: "100%",
          height: "48px",
          userSelect: "none",
          transition: "color 0.25s ease, background 0.25s ease, border 0.25s ease",
          position: "relative",
          zIndex: "4", // ensure labels appear above the divider
          borderRadius: "15px",
          margin: "2px",
        },
        ".subcat-label-completed": {
          border: "1px solid lightgreen",
          backgroundColor: "#d4f7d4",
          color: "green",
          borderRadius: "15px",
        },
        ".subcat-label-active": {
          borderWidth: "2px",
          animation: theme("animation.borderPulse"),
        },
        ".subcat-slidebar": {
          position: "absolute",
          top: "0px",
          left: "0",
          width: "calc(18% + 38px)",
          height: "48px",
          borderRadius: "calc(15px - 4px)",
          backgroundColor: "#F3F4F6",
          zIndex: "1",
          transition: "transform 0.5s cubic-bezier(0.33, 0.83, 0.99, 0.98)",
          cursor: "pointer",
          pointerEvents: "none",
        },
        
      });
    },
  ],
};