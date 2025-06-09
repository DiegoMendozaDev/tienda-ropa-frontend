// src/pages/Categoria.tsx
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import NavScroll from '../components/NavScroll'
import ProductCards, { Product } from '../components/Productos'

function Categoria() {
    const { id } = useParams<{ id: string }>()
    const [search, setSearch] = useState('')
    const [nombreCategoria, setNombreCategoria] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Construimos la URL del endpoint
    const url = `https://tienda-ropa-backend-xku2.onrender.com/api/productos/categoria/${id}`

    useEffect(() => {
        async function fetchCategoria() {
            setLoading(true)
            setError(null)
            try {
                const resp = await fetch(url)
                if (!resp.ok) {
                    throw new Error(`Error ${resp.status}`)
                }
                const data = (await resp.json()) as Array<Product & { categoria: string }>

                if (Array.isArray(data) && data.length > 0) {
                    // Tomamos el campo "categoria" del primer producto
                    setNombreCategoria(data[0].categoria)
                } else {
                    // Si el array está vacío
                    setNombreCategoria('Sin productos')
                }
            } catch (err) {
                setError('No se pudo cargar la categoría '+ err)
                setNombreCategoria(null)
            } finally {
                setLoading(false)
            }
        }

        fetchCategoria()
    }, [url])

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

            // Añadir el detalle al pedido
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

    return (
        <div style={{ paddingTop: '100px' }}>
            <NavScroll onSearchChange={setSearch} />

            {/* Mostrar spinner o mensaje de error mientras carga */}
            {loading && (
                <div className="text-center my-4">
                    <span>Cargando categoría…</span>
                </div>
            )}
            {error && (
                <div className="text-center my-4 text-danger">
                    {error}
                </div>
            )}

            {/* Sólo mostramos el título una vez que haya terminado de cargar */}
            {!loading && !error && (
                <h2 className="text-center my-4">
                    {nombreCategoria
                        ? `Categoría: ${nombreCategoria}`
                        : `Categoría ${id}`}
                </h2>
            )}

            {/* Una vez cargado, renderizamos ProductCards paseándole la misma URL */}
            {!loading && !error && (
                <ProductCards
                    url={url}
                    onAddToCart={handleAddToCart}
                    search={search}
                />
            )}
        </div>
    )
}

export default Categoria
