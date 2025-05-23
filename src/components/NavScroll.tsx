import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Bag, Heart, List, Person, X, ChevronRight, ChevronLeft } from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';

// Tipo para categorías
interface Category {
  id: string;
  nombre: string;
  subcategorias?: Category[];
}
interface NavScrollProps {
  onSearchChange: (value: string) => void;
}
// Datos de ejemplo
const categorias: Category[] = [
  { 
    id: '1', 
    nombre: 'Mujer', 
    subcategorias:[
      { id: "1-1", nombre: "bolso"},
      { id: "1-2", nombre: "vestido"}
    ]
  },
  { 
    id: '2', 
    nombre: 'Hombre', 
    subcategorias:[
      { id: "2-1", nombre:"camisa"},
      { id: "2-2", nombre:"pantalon"}
    ]
  },

];

function NavScroll({ onSearchChange }: NavScrollProps) {
  // @ts-expect-error: esta variable se declara para un futuro uso
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [show, setShow] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [searchText, setSearchText] = useState('');

  const isLoggedIn = Boolean(cookies.user);

  const handleClose = () => {
    setShow(false);
    setSelectedCat(null);
  };
  const handleShow = () => setShow(true);
  const logout = () => {
    removeCookie('user', { path: '/' });
    window.location.reload();
  };
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearchChange(value);
  };
  return (
    <Navbar fixed="top" expand="sm" className="bg-body-tertiary mb-3" style={{ padding: '2rem 3rem' }}>
      <Container fluid>
        <div className="d-flex w-100 align-items-center">
          {/* Botón Offcanvas */}
          <Button variant="outline-secondary" onClick={handleShow}>
            <List size={26} />
          </Button>

          {/* Buscador (solo en sm+) */}
          <div className="d-none d-sm-flex align-items-center gap-3 ms-3">
            <Nav className="w-100" navbarScroll>
              <Form className="d-flex w-100 justify-content-center">
                <Form.Control
                  type="search"
                  placeholder="Buscar productos"
                  className="me-2"
                  style={{ maxWidth: '300px' }}
                  value={searchText}
                  onChange={onSearch}
                />
              </Form>
            </Nav>
          </div>

          {/* Marca centrada */}
          <Navbar.Brand href="#" className="mx-auto" style={{ padding: '1rem' }}>
            StyleOnLine
          </Navbar.Brand>

          {/* Iconos y botones de usuario */}
          <div className="d-flex align-items-center gap-4">
            {isLoggedIn ? (
              <div className="d-flex align-items-center gap-2">
                <Nav.Link href="/profile"><Person size={26} /></Nav.Link>
                <Nav.Link href="/cart"><Bag size={26} /></Nav.Link>
                <Nav.Link href="/favorites"><Heart size={26} /></Nav.Link>
                <Button variant="outline-danger" onClick={logout}>Logout</Button>
              </div>
            ) : (
              <div className="d-flex">
                <Button variant="outline-primary" className="me-2" href="/login">Login</Button>
                <Button variant="outline-secondary" href="/register">Register</Button>
              </div>
            )}
          </div>
        </div>

        {/* Offcanvas con MegaMenu */}
        <Offcanvas show={show} onHide={handleClose} placement="start" style={{ width: '100%', maxWidth: 800 }}>
          <Offcanvas.Header>
            {/* Botón atrás solo si hay subcategoría abierta */}
            {selectedCat && (
              <Button variant="link" onClick={() => setSelectedCat(null)}>
                <ChevronLeft size={24} />
              </Button>
            )}
            <Offcanvas.Title className="ms-2">
              {selectedCat ? selectedCat.nombre : 'Categorías'}
            </Offcanvas.Title>
            <Button variant="link" className="ms-auto" onClick={handleClose}>
              <X size={24} />
            </Button>
          </Offcanvas.Header>
          <Offcanvas.Body style={{ padding: 0, height: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              {/* Panel categorías principales */}
              <div
                style={{
                  width: '40%',
                  borderRight: '1px solid #dee2e6',
                  overflowY: 'auto'
                }}
              >
                {categorias.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => cat.subcategorias ? setSelectedCat(cat) : window.location.href = `/categoria/${cat.id}`}
                    className="p-3 d-flex justify-content-between align-items-center"
                    style={{ cursor: 'pointer', background: selectedCat?.id === cat.id ? '#f8f9fa' : undefined }}
                  >
                    <span>{cat.nombre}</span>
                    {cat.subcategorias && <ChevronRight />}
                  </div>
                ))}
              </div>

              {/* Panel subcategorías: se monta SOLO si hay categoría seleccionada */}
              {selectedCat && (
                <div
                  style={{
                    width: '60%',
                    overflowY: 'auto',
                    background: '#fff',
                    transition: 'width 0.3s ease'
                  }}
                >
                  {selectedCat.subcategorias?.map(sub => (
                    <div
                      key={sub.id}
                      onClick={() => window.location.href = `/categoria/${sub.id}`}
                      className="p-3"
                      style={{ cursor: 'pointer' }}
                    >
                      {sub.nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavScroll;
