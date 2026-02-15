"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Une erreur est survenue.");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setErrorMsg("Erreur de connexion.");
    }
  };

  return (
    <section
      id="contact"
      style={{
        width: "100%",
        padding: "80px 20px",
        display: "flex",
        justifyContent: "center",
        background: "#1A1A1A",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgb(255, 122, 0)",
            }}
          >
            Contact
          </span>
          <h2
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 700,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Une question ? Écrivez-nous.
          </h2>
          <p
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: 16,
              color: "rgba(255,255,255,0.5)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Notre équipe vous répondra dans les plus brefs délais.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Votre nom"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                flex: "1 1 200px",
                padding: "14px 18px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontFamily: '"Outfit", sans-serif',
                fontSize: 15,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgb(255, 122, 0)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <input
              type="email"
              placeholder="Votre email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{
                flex: "1 1 200px",
                padding: "14px 18px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontFamily: '"Outfit", sans-serif',
                fontSize: 15,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgb(255, 122, 0)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <textarea
            placeholder="Votre message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontFamily: '"Outfit", sans-serif',
              fontSize: 15,
              outline: "none",
              resize: "vertical",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgb(255, 122, 0)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          />

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              alignSelf: "flex-start",
              padding: "14px 36px",
              borderRadius: 10,
              border: "none",
              background: status === "sending" ? "rgba(255,122,0,0.6)" : "rgb(255, 122, 0)",
              color: "#fff",
              fontFamily: '"Outfit", sans-serif',
              fontSize: 15,
              fontWeight: 600,
              cursor: status === "sending" ? "not-allowed" : "pointer",
              transition: "background 0.2s, transform 0.1s",
            }}
            onMouseEnter={(e) => {
              if (status !== "sending") e.currentTarget.style.background = "rgb(230, 105, 0)";
            }}
            onMouseLeave={(e) => {
              if (status !== "sending") e.currentTarget.style.background = "rgb(255, 122, 0)";
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {status === "sending" ? "Envoi en cours..." : "Envoyer"}
          </button>

          {status === "success" && (
            <p
              style={{
                color: "#4ade80",
                fontFamily: '"Outfit", sans-serif',
                fontSize: 14,
                margin: 0,
              }}
            >
              Message envoyé avec succès !
            </p>
          )}
          {status === "error" && (
            <p
              style={{
                color: "#f87171",
                fontFamily: '"Outfit", sans-serif',
                fontSize: 14,
                margin: 0,
              }}
            >
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
