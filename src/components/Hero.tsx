import React from "react";
import heroImg from "../assets/imgs/homeP.jpg";
import "./Hero.css";
export default function Hero(): JSX.Element {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-content">
        <div className="hero-subtitle">Al cuidado de caninos y felinos</div>
        <h1 className="hero-title">
          Hospital
          <br />
          Veterinario
          <br />
          Vetici
        </h1>
        <a className="hero-cta" href="#contacto">
          Ponte en contacto
        </a>
      </div>

      <div className="hero-phone">
        URGENCIAS
        <br />
        (Previa Llamada)
        <br />
        449-539-9224
      </div>

      
      
    </section>
  );
}