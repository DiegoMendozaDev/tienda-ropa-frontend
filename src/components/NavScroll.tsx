import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Bag, Heart, List, Person } from 'react-bootstrap-icons';

function NavScroll() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Navbar fixed="top" expand="sm" className="bg-body-tertiary mb-3" style={{ padding: '2rem 3rem' }}>
      <Container fluid>
        {/* Contenedor principal con tres secciones: izquierda, centro y derecha */}
        <div className="d-flex w-100 align-items-center">
          {/* Izquierda: botón offcanvas y primer enlace */}
          <div className="d-flex align-items-center gap-3">
            <Button variant="outline-secondary" onClick={handleShow}>
              <List size={26} className="ml-4" />
            </Button>
            <Nav.Link href="#action2" className="ms-3">Contact us</Nav.Link>
            <Navbar.Collapse id="navbarScroll">
          <Nav className="w-100" navbarScroll>
            <Form className="d-flex w-100 justify-content-center">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                style={{ maxWidth: '500px' }}
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Nav>
        </Navbar.Collapse>
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
            <Nav.Link href="/favorites">
              <Heart size={26} />
            </Nav.Link>
            <Nav.Link href="/cart">
              <Bag size={26} />
            </Nav.Link>
            <div className="d-flex ms-3">
              <Button variant="outline-primary" className="me-2" href="/login">Login</Button>
              <Button variant="outline-secondary" href="/register">Register</Button>
            </div>
          </div>
        </div>

        {/* Toggle y Collapse para el buscador */}
        <Navbar.Toggle aria-controls="navbarScroll" className="mt-3" />
        {/* Offcanvas */}
        <Offcanvas show={show} onHide={handleClose} backdrop="static">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            I will not close if you click outside of me.
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavScroll;
