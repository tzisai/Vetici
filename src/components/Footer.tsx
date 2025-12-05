import React from "react";
import "./footer.css";

export default function Footer(): JSX.Element {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Vetici — Clínica Veterinaria</p>
        <p>Aguascalientes Mexico · 449 5399224 · vetici@vec.com.mx</p>
      </div>
    </footer>
  );
}