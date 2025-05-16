import NavScroll from "../components/NavScroll.tsx";
import Carrusel from "../components/Carrusel.tsx";
import ProductCards, { Product } from "../components/Productos.tsx";


function Inicio() {
    const handleAddToCart = (product: Product) => {
        // Lógica para añadir producto al carrito
        alert(`Has añadido ${product.nombre} al carrito.`);
    };
    return (
        <div style={{ paddingTop: '100px' }}>
            <NavScroll />
            <Carrusel />
            <ProductCards 
                url="https://127.0.0.1:8000/api/productos/ver"
                onAddToCart={handleAddToCart}
            />
            <h1>INICIO</h1>
        </div>
    );
}
export default Inicio;