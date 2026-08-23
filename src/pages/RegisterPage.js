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
        if (res.data.length > 0) setError('Email da duoc su dung!');
        else return axios.post('http://localhost:3001/users', { name, email, password });
      })
      .then(res => {
        if (res && res.data) { login(res.data); alert('Dang ky thanh cong!'); navigate('/'); }
      })
      .catch(() => setError('Da co loi xay ra!'));
  };

  return (
    <Container className="py-5" style={{ maxWidth: '420px' }}>
      <Card className="bg-dark-card border-0 rounded-3 p-4">
        <h3 className="fw-bold text-warning text-center mb-4">Dang Ky</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-light">Ho va Ten</Form.Label>
            <Form.Control type="text" placeholder="Nguyen Van A" value={name} onChange={(e) => setName(e.target.value)} required className="bg-dark text-white border-secondary" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-light">Email</Form.Label>
            <Form.Control type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-dark text-white border-secondary" />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="text-light">Mat khau</Form.Label>
            <Form.Control type="password" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-dark text-white border-secondary" />
          </Form.Group>
          <Button type="submit" variant="warning" className="w-100 py-2 fw-bold text-dark mb-3">Tao Tai Khoan</Button>
          <div className="text-center small text-secondary">
            Da co tai khoan? <Link to="/login" className="text-warning text-decoration-none fw-bold">Dang nhap</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default RegisterPage;
