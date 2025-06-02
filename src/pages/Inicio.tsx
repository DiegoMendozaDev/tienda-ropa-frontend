import NavScroll from "../components/NavScroll.tsx";
import Carrusel from "../components/Carrusel.tsx";
import ProductCards, { Product } from "../components/Productos.tsx";
import { BodyText } from "react-bootstrap-icons";


function Inicio() {
    const handleAddToCart = async (product: Product) => {
        // Lógica para añadir producto al carrito
       

        try {
            
            function getCookieValue(name: string): string | null {
                const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                return match ? decodeURIComponent(match[2]) : null;
            }
            let id = getCookieValue("id")
            fetch('http://127.0.0.1:8000/api/pedido/create', {
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
                let idpedido = getCookieValue("id_pedido");
                
            fetch('http://127.0.0.1:8000/api/detalle/create', {
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
            <h1>INICIO</h1>
            <NavScroll />
            <Carrusel />
            <ProductCards
                url="http://127.0.0.1:8000/api/productos/ver"
                onAddToCart={handleAddToCart}
            />

        </div>
    );
}
export default Inicio;
