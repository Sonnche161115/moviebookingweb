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
    <Navbar expand="lg" className="navbar sticky-top mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo me-3">IMDb</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" className="bg-secondary" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-white fw-bold me-2">Trang chu</Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/history" className="text-white me-2">Ve cua toi</Nav.Link>
            )}
            {isAdmin() && (
              <Nav.Link as={Link} to="/admin" className="text-warning fw-bold me-2">Quan ly phim</Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-center">
            {user ? (
              <>
                <span className="text-warning me-3 small fw-bold">
                  {user.name} {isAdmin() ? '(Admin)' : ''}
                </span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>Dang xuat</Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-warning" size="sm" className="me-2">Dang nhap</Button>
                <Button as={Link} to="/register" variant="warning" size="sm">Dang ky</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
