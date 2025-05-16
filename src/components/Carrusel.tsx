import Carousel from 'react-bootstrap/Carousel';
import { useEffect, useState } from "react";
import { getFormData } from '../services/GetService';
import Spinner from 'react-bootstrap/Spinner';
// Define el tipo que la API devuelve para cada slide
interface Slide {
  foto: string;
  nombre: string;
  descripcion: string;
}


function Carrusel() {
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Llama a la API; aquí ejemplo con sin parámetros
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    getFormData<{}, Slide[]>("https://127.0.0.1:8000/api/productos/masVendidos", {})
      .then((data) => setSlides(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div>Error cargando slides: {error}</div>;
  }

  if (slides === null) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <Spinner animation="border" role="status" aria-hidden="true" />{" "}
        <span className="visually-hidden">Cargando slides...</span>
      </div>
    );
  }
    // Petición OK pero array vacío
  if (slides.length === 0) {
    return <div>No hay slides disponibles.</div>;
  }
  return (
    <Carousel data-bs-theme="dark">
      {slides.map(({ foto, nombre, descripcion }, idx) => (
        <Carousel.Item key={idx} interval={1000}>
          <img
            className="d-block w-100"
            src={foto}
            style={{
              maxHeight: '600px',
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