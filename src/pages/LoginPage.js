import React, { useState, useContext } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get('http://localhost:3001/users?email=' + email + '&password=' + password)
      .then(res => {
        if (res.data.length > 0) {
          login(res.data[0]);
          navigate('/');
        } else {
          setError('Email hoặc mật khẩu không chính xác!');
        }
      })
      .catch(() => setError('Đã có lỗi xảy ra!'));
  };

  return (
    <Container className="py-5" style={{ maxWidth: '420px' }}>
      <Card className="card-dark p-4">
        <h3 className="text-warning text-center fw-bold mb-4">Đăng Nhập</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-white fw-bold">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email của bạn (vd: user@gmail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="text-white fw-bold">Mật Khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
          <Button type="submit" variant="warning" className="w-100 py-2 mb-3">
            Đăng Nhập
          </Button>
          <div className="text-center small text-secondary">
            Chưa có tài khoản? <Link to="/register" className="text-warning fw-bold text-decoration-none">Đăng Ký Ngay</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;
