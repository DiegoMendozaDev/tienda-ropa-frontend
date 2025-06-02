// src/pages/Genero.tsx
import { useParams } from 'react-router-dom';
import NavScroll from '../components/NavScroll';
import ProductCards, { Product } from '../components/Productos';
import { useState } from 'react';

function Genero() {
    const { genero } = useParams<{ genero: string }>();
    const [search, setSearch] = useState('');

    const handleAddToCart = (product: Product) => {
        alert(`Has añadido ${product.nombre} al carrito.`);
    };

    // Monta la URL según el género seleccionado
    const url = `https://127.0.0.1:8000/api/productos/genero/${genero}`;

    return (
        <div style={{ paddingTop: '100px' }}>
            <NavScroll onSearchChange={setSearch} />
            <h2 className="text-center my-4">
                {genero === 'chico' ? 'Tienda para Él' : 'Tienda para Ella'}
            </h2>
            <ProductCards
                url={url}
                onAddToCart={handleAddToCart}
                search={search}
            />
        </div>
    );
}

export default Genero;
