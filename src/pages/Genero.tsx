// src/pages/Genero.tsx
import { useParams } from 'react-router-dom';
import NavScroll from '../components/NavScroll';
import ProductCards, { Product } from '../components/Productos';
import { useState } from 'react';

function Genero() {
    const { genero } = useParams<{ genero: string }>();
    const [search, setSearch] = useState('');

    const handleAddToCart = async (product: Product) => {
        // Función auxiliar para leer cookies
        const getCookieValue = (name: string): string | null => {
            const match = document.cookie.match(
                new RegExp("(^| )" + name + "=([^;]+)")
            );
            return match ? decodeURIComponent(match[2]) : null;
        };

        const idUsuario = getCookieValue("id_usuario");
        if (!idUsuario) {
            alert("Debes iniciar sesión para añadir al carrito");
            return;
        }

        try {
            // Crear o recuperar el pedido
            const resPedido = await fetch(
                "https://tienda-ropa-backend-xku2.onrender.com/api/pedido/create",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_usuario: idUsuario, estado: "preparando" }),
                }
            );
            if (!resPedido.ok) {
                throw new Error(`Error creando pedido (${resPedido.status})`);
            }
            const { id_pedido } = await resPedido.json();

            // Guardar el id_pedido en cookie
            document.cookie = `id_pedido=${id_pedido}; path=/; max-age=3600`;

            // 2) Añadir el detalle al pedido
            const resDetalle = await fetch(
                "https://tienda-ropa-backend-xku2.onrender.com/api/detalle/create",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_producto: product.id,
                        id_pedido: id_pedido,
                        cantidad: 1,
                    }),
                }
            );
            if (!resDetalle.ok) {
                throw new Error(`Error creando detalle (${resDetalle.status})`);
            }

            alert(`Has añadido "${product.nombre}" al carrito.`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("handleAddToCart error:", err);
            alert("No se pudo añadir al carrito. Intenta de nuevo.");
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
