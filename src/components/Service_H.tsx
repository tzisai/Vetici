import React from "react";
import "./Service.css";
import consulta from "../assets/imgs/consulta.jpg";
import vacuna from "../assets/imgs/vacuna.jpg";
import cirugia from "../assets/imgs/cirugia.jpg";
import estetica from "../assets/imgs/estetica.jpg";
import productos from "../assets/imgs/productos_img.jpg";
export default function Service_H(): JSX.Element {
   
    return(
        <section id="servicios">
            <h2 className="Titulo_S">Nuestros Servicios</h2>
            <div className="container_S">

                <div className="Columna_S">
                    <h3 className="Subtitulo_S">Consulta General</h3>
                    <p className="Parrafo_S">Exámenes de salud, diagnóstico y tratamiento de enfermedades comunes en mascotas.</p>
                    <img src={consulta} alt="Consulta_img" />
                </div>

                <div className="Columna_S">
                    <h3 className="Subtitulo_S">Vacunación</h3>
                    <p className="Parrafo_S">Programas de vacunación para prevenir enfermedades infecciosas en perros y gatos.</p>
                    <img src={vacuna} alt="Vacuna_Img" />
                </div>

                <div className="Columna_S">
                    <h3 className="Subtitulo_S">Cirugía</h3>
                    <p className="Parrafo_S">Procedimientos quirúrgicos seguros y efectivos, desde esterilizaciones hasta cirugías complejas.</p>   
                    <img src={cirugia} alt="Cirugia_Img" />
                </div>

                <div className="Columna_S">
                    <h3 className="Subtitulo_S">Estetica</h3>
                    <p className="Parrafo_S">Prestamos un servicio profesional para el cuidado y limpieza de tus mascotas</p>
                    <img src={estetica} alt="Estetica_Perro" />
                </div>

                <div className="Columna_S">
                    <h3 className="Subtitulo_S">Tienda de Productos en Linea</h3>
                    <p className="Parrafo_S">Amplia variedad de alimentos, juguetes y accesorios para el cuidado de tus mascotas.</p>
                    <img src={productos} alt="Productos mascotas" />
                </div>

        </div>
        </section>
    );
}