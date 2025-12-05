import React from "react";
import "./About.css";
import catImage from "../assets/imgs/cat.png";
export default function About(): JSX.Element {
    return (
        <section>


            <div className="about_us">
                <div className="Grid_about">
                <div className ="col_about">
                    <h2 className="titulo_about">Acerca de Nosotros</h2>
                        <p className="parrafo_about">
                        En Vetici, nos dedicamos a brindar atención veterinaria de calidad
                        </p>
                        <p className="parrafo_about">
                        En nuestra veterinaria puede gozar de una amplia gama de servicios diseñados para cuidar la salud y el bienestar de sus mascotas. Contamos con un equipo de profesionales altamente capacitados y apasionados por los animales, que se esfuerzan por ofrecer la mejor atención posible.    
                        </p>
                    </div>
                    <div className="col_about">
                        <img src={catImage} alt="About Us" className="about_image"/>
                    </div>
                
                
                </div>
        
        
      </div>
        </section>




    );

}