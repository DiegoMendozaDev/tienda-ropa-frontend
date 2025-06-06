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
