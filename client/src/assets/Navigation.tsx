import { useState } from "react";

export default function Navigation() {
  const [active, setActive] = useState("Main"); // default active button

  const buttons = ["Main", "Saved Posts", "Settings"];

  return (
    <nav
      className="navigation-bar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#c1ccda",
        padding: "0vw 10vw", //80% width
        color: "#555555ff"
      }}
    >
      <div className="nav-left" style={{display: "flex", alignItems:"center", gap:"0.6rem"}}>
        <p style={{ fontSize: "32px", marginBlock:"10px" }}>Smart Blog</p>
      </div>

      <div
        className="nav-right"
        style={{ display: "flex", alignItems: "center", gap: "0rem 1rem" }}
      >
        {buttons.map((btn) => (
          <button
            key={btn}
            className="nav-btn"
            onClick={() => setActive(btn)}
            style={{
              backgroundColor: active === btn ? "white" : "#c1ccda",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              borderRadius: "12px",
            color: "#555555ff"

            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </nav>
  );
}
