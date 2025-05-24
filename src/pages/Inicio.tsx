import NavScroll from "../components/NavScroll.tsx";
import Carrusel from "../components/Carrusel.tsx";
import ProductCards, { Product } from "../components/Productos.tsx";
import { useState } from "react";

function Inicio() {
    const [search, setSearch] = useState('');
    const handleAddToCart = (product: Product) => {
        // Lógica para añadir producto al carrito
        alert(`Has añadido ${product.nombre} al carrito.`);
    };
    return (
        <div style={{ paddingTop: '100px' }}>
            <NavScroll onSearchChange={setSearch}/>
            <Carrusel />
            <ProductCards 
                url="https://127.0.0.1:8000/api/productos/ver"
                onAddToCart={handleAddToCart}
                search={search}
            />
            <h1>INICIO</h1>
        </div>
    );
}
export default Inicio;