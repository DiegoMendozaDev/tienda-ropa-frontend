import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Card, Button, Row, Col, Container, Spinner } from 'react-bootstrap';
import { getFormData } from '../services/GetService';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

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
    search?: string;
}

function ProductCards({ url, onAddToCart, search = '' }: ProductCardsProps) {
    const [productos, setProductos] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const loader = useRef<HTMLDivElement | null>(null);

    // Leer cookies para saber si está logueado
    const [cookies] = useCookies(['user']);
    const navigate = useNavigate();

    const fetchProductos = useCallback(() => {
        setLoading(true);
        getFormData<Record<string, never>, Product[]>(`${url}?page=${page}`, {})
            .then(data => {
                if (data.length === 0) {
                    setHasMore(false);
                } else {
                    setProductos(prev => [...prev, ...data]);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [url, page]);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

    useEffect(() => {
        if (loading || !hasMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prev => prev + 1);
            }
        });

        if (loader.current) observer.current.observe(loader.current);
    }, [loading, hasMore]);

    const productosFiltrados = useMemo(() => {
        return productos.filter(p =>
            p.nombre.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, productos]);

    return (
        <Container className="py-4">
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {productosFiltrados.map(producto => (
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
                                    {onAddToCart && (
                                        <Button
                                            variant="primary"
                                            onClick={() => {
                                                // Si no hay cookie "user", redirige a login
                                                if (!cookies.user) {
                                                    navigate('/login');
                                                } else {
                                                    // Si está logueado, llama a la función
                                                    onAddToCart(producto);
                                                }
                                            }}
                                        >
                                            Añadir al carrito
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {loading && (
                <div className="text-center py-4">
                    <Spinner animation="border" role="status" />
                </div>
            )}
            <div ref={loader} />
            {error && <div className="text-danger">Error cargando productos: {error}</div>}
            {!hasMore && <div className="text-center py-4">No hay más productos.</div>}
        </Container>
    );
}

export default ProductCards;
