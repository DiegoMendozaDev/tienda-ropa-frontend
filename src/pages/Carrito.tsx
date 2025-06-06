import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

type Producto = {
    id: number;
    nombre: string;
    id_producto: number;
    precio: number;
    cantidad: number;
    foto: string;
};

function Carrito() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function obtenerProductos() {
            try {
                function getCookieValue(name: string): string | null {
                    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                    return match ? decodeURIComponent(match[2]) : null;
                }
                // eslint-disable-next-line prefer-const
                let idUsuario = getCookieValue("id_usuario")
                if (!idUsuario) {
                    console.error('No se encontró la cookie "id_usuario"')
                    setCargando(false)
                    return
                }
                const res = await fetch("https://tienda-ropa-backend-xku2.onrender.com/api/pedido/verCarrito", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "id_usuario": idUsuario,
                        "estado": "preparando"

                    }),
                })
                if (!res.ok) {
                    console.error('Error en la petición:', res.status, res.statusText)
                    setCargando(false)
                    return
                }
                const data = await res.json();
                console.log("Data completa:", data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const productosProcesados: Producto[] = data.detalles.map((detalle: any) => ({
                    id: detalle.id_detalle,
                    id_producto: detalle.id_producto,
                    nombre: detalle.nombre,
                    precio: detalle.precio ?? 0,
                    cantidad: detalle.cantidad ?? 1,
                    foto: detalle.foto
                }))
                console.log("Productos procesados:", productosProcesados);
                setProductos(productosProcesados);
            } catch (error) {
                console.error("Error al obtener el carrito:", error);
            } finally {
                setCargando(false);
            }
        }

        obtenerProductos();
    }, []);
    /** Llama al endpoint PUT para actualizar un detalle en la BBDD */
    async function actualizarDetalleEnServidor(
        id_detalle: number,
        id_producto: number,
        cantidad: number,
        precio_unitario: number
    ) {
        try {
            const res = await fetch(
                `https://tienda-ropa-backend-xku2.onrender.com/api/detalle/update/${id_detalle}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_producto: id_producto,
                        cantidad: cantidad,
                        precio_unitario: precio_unitario
                    })
                }
            );
            if (!res.ok) {
                console.error(
                    'Error al actualizar detalle en servidor:',
                    res.status,
                    res.statusText
                );
            }
            // Si deseas procesar la respuesta, haz `await res.json()` aquí
        } catch (error) {
            console.error('Error en fetch PUT:', error);
        }
    }

    const actualizarCantidad = (id: number, nuevaCantidad: number) => {
        setProductos(prev =>
            prev.map(p =>
                p.id === id ? { ...p, cantidad: nuevaCantidad } : p
            )
        );
    };

    // Envía DELETE a la API y, si funciona, lo quita del estado
    const eliminarProducto = async (idDetalle: number) => {
        try {
            const res = await fetch(
                `https://tienda-ropa-backend-xku2.onrender.com/api/detalle/delete/${idDetalle}`,
                {
                    method: 'DELETE'
                }
            )
            if (!res.ok) {
                console.error('Error al eliminar detalle:', res.status, res.statusText)
                return
            }
            // Si la respuesta es correcta, lo quitamos del estado local
            setProductos(prev => prev.filter(p => p.id !== idDetalle))
        } catch (error) {
            console.error('Error en la petición DELETE:', error)
        }
    }
    const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    if (cargando) {
        return <p className="text-center mt-10">Cargando carrito...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white shadow rounded">
            <h1 className="text-3xl font-bold mb-6 text-center">🛒 Carrito de Compras</h1>

            {productos.length === 0 ? (
                <p className="text-center text-gray-500">Tu carrito está vacío.</p>
            ) : (
                <div>
                    <ul className="space-y-6">
                        {productos.map(producto => (
                            <li
                                key={producto.id}
                                className="flex items-center justify-between gap-4 border-b pb-4"
                            >
                                <img
                                    src={producto.foto}
                                    alt={producto.nombre}
                                    className="rounded border img-fluid"
                                    style={{ maxWidth: '256px', maxHeight: '256px', objectFit: 'cover' }}
                                />
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">{producto.nombre}</h2>
                                    <p className="text-gray-600">Precio: €{producto.precio.toFixed(2)}</p>
                                    <div className="mt-2">
                                        <label className="text-sm">
                                            Cantidad:
                                            <input
                                                type="number"
                                                min="1"
                                                value={producto.cantidad}
                                                onChange={e =>{
                                                    const nuevaCant = Math.max(1, parseInt(e.target.value) || 1);
                                                    actualizarCantidad(producto.id, nuevaCant)
                                                    
                                                    actualizarDetalleEnServidor(
                                                        producto.id,
                                                        producto.id_producto,
                                                        nuevaCant,
                                                        producto.precio
                                                    );
                                                }
                                                }
                                                className="ml-2 w-16 border rounded px-2 py-1"
                                            />
                                        </label>
                                    </div>
                                </div>
                                <button
                                    onClick={() => eliminarProducto(producto.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
                                >
                                    ❌ Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 text-right">
                        <h3 className="text-2xl font-bold">Total: €{total.toFixed(2)}</h3>
                        {document.cookie = `total=${encodeURIComponent(total.toFixed(2))}; path=/; max-age=3600}`}
                    </div>
                    <div>
                        <Link to="/pagar">
                            <button
                                style={{
                                    backgroundColor: '#0070f3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    transition: 'background-color 0.3s'
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0059c1')}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0070f3')}
                            >
                                🛒 Pagar
                            </button>
                        </Link>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Carrito;
