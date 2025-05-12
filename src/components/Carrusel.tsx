import Carousel from 'react-bootstrap/Carousel';
import React, { useEffect, useState } from "react";
import { getFormData } from '../services/GetService';
// Define el tipo que la API devuelve para cada slide
interface Slide {
  foto: string;
  nombre: string;
  descripcion: string;
}
const slides = [
  { src: '/assets/imgs/camisa_blanca.jpg', alt: 'First slide', captionTitle: 'First slide label', captionText: 'Nulla vitae elit libero…' },
  { src: '/assets/imgs/pantalon_LV.jpg', alt: 'Second slide', captionTitle: 'Second slide label', captionText: 'Lorem ipsum dolor…' },
  { src: '/assets/imgs/vestido_rosa.jpg', alt: 'Third slide', captionTitle: 'Third slide label', captionText: 'Praesent commodo cursus…' },
];

function Carrusel() {
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Llama a la API; aquí ejemplo con sin parámetros
    getFormData<{}, Slide[]>("https://127.0.0.1:8000/api/productos/masVendidos", {})
      .then((data) => setSlides(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div>Error cargando slides: {error}</div>;
  }

  if (!slides) {
    return <div>Cargando slides...</div>;
  }
  return (
    <Carousel data-bs-theme="dark">
      {slides.map(({ foto, nombre, descripcion }, idx) => (
        <Carousel.Item key={idx} interval={1000}>
          <img
            className="d-block w-100"
            src={foto}
            style={{
              maxHeight: '500px',
            }}
          />
          <Carousel.Caption>
            <h3>{nombre}</h3>
            <p>{descripcion}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default Carrusel;