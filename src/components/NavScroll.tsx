import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Bag, Heart, List, Person } from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';

function NavScroll() {
  // @ts-ignore: TS6133
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [show, setShow] = useState(false);

  const isLoggedIn = Boolean(cookies.user);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Función para cerrar sesión: elimina la cookie y puede redirigir o actualizar
  const logout = () => {
    removeCookie('user', { path: '/' });
    // Opcional: redirigir o refrescar la página
    window.location.reload();
  };
  return (
    <Navbar fixed="top" expand="sm" className="ms-auto d-flex bg-body-tertiary mb-3" style={{ padding: '2rem 3rem' }}>
      <Container fluid>
        {/* Contenedor principal con tres secciones: izquierda, centro y derecha */}
        <div className="d-flex w-100 align-items-center">
          {/* Izquierda: botón offcanvas y primer enlace */}
          <div className="d-flex align-items-center gap-3">
            <Button variant="outline-secondary" onClick={handleShow}>
              <List size={26} className="ml-4" />
            </Button>
            <div className='d-none d-sm-flex align-items-center gap-3'>
            <Nav className="w-100" navbarScroll>
              <Form className="d-flex w-100 justify-content-center">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  style={{ maxWidth: '300px' }}
                />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Nav>
            </div>
          </div>

          {/* Centro: marca centrada */}
          <Navbar.Brand href="#" className="mx-auto" style={{ padding: '1rem' }}>
            Navbar scroll
          </Navbar.Brand>

          {/* Derecha: iconos clicables y botones de Login/Register */}
          <div className="d-flex align-items-center gap-4">
            <Nav.Link href="/profile">
              <Person size={26} />
            </Nav.Link>
            <Nav.Link href="/cart">
              <Bag size={26} />
            </Nav.Link>
            <Nav.Link href="/favorites">
              <Heart size={26} />
            </Nav.Link>

            {/* Renderiza Login/Register si no está logueado, sino Logout */}
            {isLoggedIn ? (
              <div className="d-flex align-items-center gap-2 ms-3">
                <Button variant="outline-danger" onClick={logout}>Logout</Button>
              </div>
            ) : (
              <div className="d-flex ms-3">
                <Button variant="outline-primary" className="me-2" href="/login">Login</Button>
                <Button variant="outline-secondary" href="/register">Register</Button>
              </div>
            )}
          </div>
        </div>

        {/* Offcanvas */}
        <Offcanvas show={show} onHide={handleClose} backdrop="static">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            I will not close if you click outside of me.
            <div className='d-block d-sm-none'>
            <Form className="d-flex mb-3">
              <Form.Control
                type="search"
                placeholder="Search"
                aria-label="Search"
                className="me-2"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
            </div>

          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavScroll;