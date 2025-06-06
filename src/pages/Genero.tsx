// src/pages/Genero.tsx
import { useParams } from 'react-router-dom';
import NavScroll from '../components/NavScroll';
import ProductCards, { Product } from '../components/Productos';
import { useState } from 'react';

function Genero() {
    const { genero } = useParams<{ genero: string }>();
    const [search, setSearch] = useState('');

    const handleAddToCart = (product: Product) => {
        // Lógica para añadir producto al carrito 
        try {
            
            function getCookieValue(name: string): string | null {
                const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                return match ? decodeURIComponent(match[2]) : null;
            }
            // eslint-disable-next-line prefer-const
            let id = getCookieValue("id_usuario")
            fetch('https://tienda-ropa-backend-xku2.onrender.com/api/pedido/create', {
                method: 'POST',
                body: JSON.stringify({
                    "id_usuario": id,
                    "estado": "preparando"
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json()) // <- Aquí se convierte el stream a JSON
                .then(data => 
                    document.cookie = `id_pedido=${encodeURIComponent(data.id_pedido)}; path=/; max-age=3600`
                    
                )
                .catch(error => console.error(error));

            alert(`Has añadido ${product.nombre} al carrito.`);
            // eslint-disable-next-line prefer-const
            let idpedido = getCookieValue("id_pedido");
                
            fetch('https://tienda-ropa-backend-xku2.onrender.com/api/detalle/create', {
                method: 'POST',
                body: JSON.stringify({
                    "id_producto": product.id,
                    "id_pedido": idpedido,
                    "cantidad": 1
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json()) // <- Aquí se convierte el stream a JSON
                .then(data => console.log(data))
                .catch(error => console.error(error));

        } catch (err) {
            console.error(err);
        }
    
    };

    // Monta la URL según el género seleccionado
    const url = `https://tienda-ropa-backend-xku2.onrender.com/api/productos/genero/${genero}`;

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
