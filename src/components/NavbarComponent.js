import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavbarComponent = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="custom-navbar sticky-top mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="imdb-logo-brand">IMDb</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" className="bg-secondary" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto ms-3">
            <Nav.Link as={Link} to="/" className="fw-bold text-white me-3">Trang chu</Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/history" className="fw-bold text-white me-3">Ve cua toi</Nav.Link>
            )}
            {isAdmin() && (
              <Nav.Link as={Link} to="/admin" className="fw-bold text-warning me-3">Quan ly phim</Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-center">
            {user ? (
              <>
                <span className="me-3 fw-bold text-warning">
                  {user.name} {isAdmin() ? '(Admin)' : ''}
                </span>
                <Button variant="outline-light" size="sm" onClick={handleLogout} className="px-3 fw-bold">Dang xuat</Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-warning" size="sm" className="me-2 px-3 fw-bold">Dang nhap</Button>
                <Button as={Link} to="/register" variant="warning" size="sm" className="px-3 fw-bold text-dark">Dang ky</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
