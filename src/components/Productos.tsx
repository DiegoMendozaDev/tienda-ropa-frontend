import { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Container, Spinner } from 'react-bootstrap';
import { getFormData } from '../services/GetService';

// Define la interfaz que la API devuelve para cada producto
export interface Product {
    id: string | number;
    nombre: string;
    descripcion: string;
    precio: number;
    marca: string;
    id_categoria: number;
    foto: string;
    stock: number;
    unidades_vendidas: number;
}

interface ProductCardsProps {
    url: string;
    onAddToCart?: (product: Product) => void;
}

function ProductCards({ url, onAddToCart }: ProductCardsProps) {
    const [productos, setProductos] = useState<Product[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Llama a la API para obtener los productos desde la URL pasada
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        getFormData<{}, Product[]>(
            url,
            {}
        )
            .then(data => setProductos(data))
            .catch(err => setError(err.message));
    }, [url]);

    if (error) {
        return <div className="text-danger">Error cargando productos: {error}</div>;
    }

    if (productos === null) {
        return (
            <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" role="status" aria-hidden="true" />
                <span className="visually-hidden">Cargando productos...</span>
            </div>
        );
    }

    if (productos.length === 0) {
        return <div>No hay productos disponibles.</div>;
    }

    return (
        <Container className="py-4">
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {productos.map(producto => (
                    <Col key={producto.id}>
                        <Card className="h-100">
                            <Card.Img
                                variant="top"
                                src={producto.foto}
                                alt={producto.nombre}
                                style={{ objectFit: 'cover', height: '200px' }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{producto.nombre}</Card.Title>
                                <Card.Text className="flex-grow-1">
                                    {producto.descripcion}
                                </Card.Text>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">€{producto.precio.toFixed(2)}</h5>
                                    {onAddToCart ? (
                                        <Button
                                            variant="primary"
                                            onClick={() => onAddToCart(producto)}
                                        >
                                            Añadir al carrito
                                        </Button>
                                    ) : null}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default ProductCards;
