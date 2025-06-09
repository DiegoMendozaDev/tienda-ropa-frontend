import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Bag, List, Person, X, ChevronRight, ChevronLeft } from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

// Tipo para categorías
interface Category {
  id: string;
  nombre: string;
  subcategorias?: Category[];
  slug?: string;
}
interface NavScrollProps {
  onSearchChange: (value: string) => void;
}

function getCookieValue(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
function NavScroll({ onSearchChange }: NavScrollProps) {
  const navigate = useNavigate();
  // @ts-expect-error: esta variable se declara para un futuro uso
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(['user','rol', 'id_usuario', 'id_pedido', 'total']);
  const [show, setShow] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState('');
  const extraCategorias: Category[] = [
    { id: '100', nombre: 'Chico', slug: 'chico' },
    { id: '200', nombre: 'Chica', slug: 'chica' },
  ];
  useEffect(() => {
    fetch('https://tienda-ropa-backend-xku2.onrender.com/api/categoria/ver')
      .then(res => res.json())
      .then((data: Array<{ id_categoria: number; nombre: string; descripcion: string }>) => {
        const apiCats = data.map(c => ({
          id: String(c.id_categoria),
          nombre: c.nombre,
          descripcion: c.descripcion,
        }));
        // Prepend extraCategorias delante de apiCats:
        setCategorias([
          ...extraCategorias,
          ...apiCats
        ]);
      })
      .catch(console.error);
  }, []);
  const isLoggedIn = Boolean(cookies.user);

  const handleClose = () => {
    setShow(false);
    setSelectedCat(null);
  };
  const handleShow = () => setShow(true);
  const logout = () => {
    removeCookie('user', { path: '/' });
    removeCookie('rol', { path: '/' });
    removeCookie('id_usuario', { path: '/' });
    removeCookie('id_pedido', { path: '/' });
    removeCookie('total', { path: '/' });
    window.location.reload();
  };
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearchChange(value);
  };
  
  // Esto puede ser string o null
  const rolCookie = getCookieValue("rol") ?? '[ROLE_USER]'; // si es null, usa '[ROLE_USER]'
  

// Aquí aseguras que 'roldef' sea un array, aunque la cookie sea null o indefinida
// let roldef: string[] = rolCookie ? JSON.parse(rolCookie) : [];
//   if(rolCookie){
//      const roles: string[] = JSON.parse(rolCookie);
//      roldef = roles

  return (
  
      
    <Navbar fixed="top" expand="sm" className="bg-body-tertiary mb-3" style={{ padding: '2rem 3rem' }}>
      <Container fluid>
        <div className="d-flex w-100 align-items-center">
          {/* Botón Offcanvas */}
          <Button variant="outline-secondary" onClick={handleShow}>
            <List size={26} />
          </Button>

          {/* Buscador */}
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
          <Navbar.Brand href="/" className="mx-auto" style={{ padding: '1rem' }}>
            StyleOnLine
          </Navbar.Brand>

          {/* Iconos y botones de usuario */}
          <div className="d-flex align-items-center gap-4">
            {isLoggedIn ? (
              <div className="d-flex align-items-center gap-2">
                <Nav.Link href="/usuario"><Person size={26} /></Nav.Link>
                <Nav.Link href="/carrito"><Bag size={26} /></Nav.Link>
                <Button variant="outline-danger" onClick={logout}>Logout</Button>
                {rolCookie.includes("admin") && (
  <Button variant="outline-warning" href="/admin">Admin Panel</Button>
)}

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
                    onClick={() => {
                      if (cat.subcategorias) {
                        setSelectedCat(cat);
                      } else {
                        // FORZAMOS recarga completa en lugar de navigate()
                        if (cat.slug === 'chico') {
                          window.location.href = '/tienda/chico';
                        } else if (cat.slug === 'chica') {
                          window.location.href = '/tienda/chica';
                        } else {
                          window.location.href = `/categoria/${cat.id}`;
                        }
                        handleClose();
                      }
                    }}
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
                      onClick={() => {
                        if (sub.slug === 'chico') {
                          navigate('/tienda/chico');
                        } else {
                          navigate(`/tienda/${sub.id}`);
                        }
                    }}
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
