import React, { useState, useContext } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get('http://localhost:3001/users?email=' + email)
      .then(res => {
        if (res.data.length > 0) {
          setError('Email nay da duoc su dung!');
        } else {
          return axios.post('http://localhost:3001/users', { name, email, password, role: 'user' });
        }
      })
      .then(res => {
        if (res && res.data) {
          login(res.data);
          alert('Dang ky thanh cong!');
          navigate('/');
        }
      })
      .catch(() => setError('Da co loi xay ra!'));
  };

  return (
    <Container className="py-5" style={{ maxWidth: '420px' }}>
      <Card className="card-dark p-4">
        <h3 className="text-warning text-center fw-bold mb-4">Dang Ky</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-white fw-bold">Ho va Ten</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhap ho ten cua ban"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-white fw-bold">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhap email cua ban"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="text-white fw-bold">Mat khau</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhap mat khau"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
          <Button type="submit" variant="warning" className="w-100 py-2 mb-3">
            Tao Tai Khoan
          </Button>
          <div className="text-center small text-secondary">
            Da co tai khoan? <Link to="/login" className="text-warning fw-bold text-decoration-none">Dang nhap</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default RegisterPage;
