import { useEffect, useState } from "react";

type Producto = {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen: string;
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
                let id = getCookieValue("id")
                const res = await fetch("https://tienda-ropa-backend-xku2.onrender.com/api/pedido/verCarrito", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "id_usuario": id,
                        "estado": "preparando"

                    }),
                });;
                const data = await res.json();
                console.log("Data completa:", data);
                const item = data;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const productosProcesados: Producto[] = item.detalles.map((detalle: any) => ({
                    id: item.id_pedido,
                    nombre: detalle.nombre,
                    precio: detalle.precio ?? 0,
                    cantidad: detalle.cantidad ?? 1,
                    imagen: ""
                }));

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

    const actualizarCantidad = (id: number, nuevaCantidad: number) => {
        setProductos(prev =>
            prev.map(p =>
                p.id === id ? { ...p, cantidad: nuevaCantidad } : p
            )
        );
    };

    const eliminarProducto = (id: number) => {
        setProductos(prev => prev.filter(p => p.id !== id));
    };
    console.log("Productos:" + productos)
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
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="w-20 h-20 object-cover rounded border"
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
                                                onChange={e =>
                                                    actualizarCantidad(producto.id, parseInt(e.target.value))
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
                    </div>
                </div>
            )}
        </div>
    );
}

export default Carrito;
