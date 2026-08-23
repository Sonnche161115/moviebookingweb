import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminPage = () => {
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', poster: '', description: '', trailer: '',
    genre: '', rating: '', duration: '', releaseDate: '',
    status: 'now_showing', director: '', cast: ''
  });

  useEffect(() => {
    if (!isAdmin()) { navigate('/'); return; }
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    axios.get('http://localhost:3001/movies')
      .then(res => { setMovies(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ title: '', poster: '', description: '', trailer: '',
      genre: '', rating: '', duration: '', releaseDate: '',
      status: 'now_showing', director: '', cast: '' });
    setEditing(null);
    setError('');
  };

  const handleOpen = (movie) => {
    if (movie) {
      setEditing(movie.id);
      setForm({
        title: movie.title, poster: movie.poster, description: movie.description,
        trailer: movie.trailer || '', genre: movie.genre ? movie.genre.join(', ') : '',
        rating: movie.rating, duration: movie.duration, releaseDate: movie.releaseDate,
        status: movie.status, director: movie.director || '', cast: movie.cast ? movie.cast.join(', ') : ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleClose = () => { setShowModal(false); resetForm(); };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.poster) { setError('Vui long nhap ten phim va poster!'); return; }
    const movieData = {
      title: form.title, poster: form.poster, backdrop: form.poster,
      description: form.description, trailer: form.trailer,
      genre: form.genre.split(',').map(g => g.trim()).filter(g => g),
      rating: parseFloat(form.rating) || 0, duration: parseInt(form.duration) || 0,
      releaseDate: form.releaseDate, status: form.status,
      director: form.director, cast: form.cast.split(',').map(c => c.trim()).filter(c => c)
    };
    if (editing) {
      axios.put('http://localhost:3001/movies/' + editing, movieData)
        .then(() => { fetchMovies(); handleClose(); })
        .catch(() => setError('Loi khi cap nhat phim!'));
    } else {
      axios.post('http://localhost:3001/movies', movieData)
        .then(() => { fetchMovies(); handleClose(); })
        .catch(() => setError('Loi khi them phim!'));
    }
  };

  const handleDelete = (id, title) => {
    if (window.confirm('Xoa phim "' + title + '"?')) {
      axios.delete('http://localhost:3001/movies/' + id)
        .then(() => fetchMovies())
        .catch(() => alert('Loi khi xoa phim!'));
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>;

  return (
    <Container className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-white mb-0">Quan Ly Phim (Admin)</h3>
        <Button variant="warning" className="fw-bold text-dark" onClick={() => handleOpen(null)}>Them Phim Moi</Button>
      </div>

      <div className="bg-dark-card rounded-3 p-3">
        <Table variant="dark" hover responsive className="mb-0">
          <thead>
            <tr className="text-warning">
              <th>ID</th>
              <th>Poster</th>
              <th>Ten phim</th>
              <th>The loai</th>
              <th>Rating</th>
              <th>Trang thai</th>
              <th>Hanh dong</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td><img src={m.poster} alt="" style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                <td className="fw-bold">{m.title}</td>
                <td>{m.genre ? m.genre.join(', ') : ''}</td>
                <td className="text-warning fw-bold">{m.rating}</td>
                <td>{m.status === 'now_showing' ? <span className="badge bg-success">Dang chieu</span> : <span className="badge bg-secondary">Sap chieu</span>}</td>
                <td>
                  <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleOpen(m)}>Sua</Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(m.id, m.title)}>Xoa</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleClose} size="lg" centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton className="border-secondary">
          <Modal.Title className="text-warning fw-bold">{editing ? 'Sua Phim' : 'Them Phim Moi'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Ten phim</Form.Label>
              <Form.Control name="title" value={form.title} onChange={handleChange} required className="bg-dark text-white border-secondary" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Poster URL</Form.Label>
              <Form.Control name="poster" value={form.poster} onChange={handleChange} required className="bg-dark text-white border-secondary" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Mo ta</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={handleChange} className="bg-dark text-white border-secondary" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Trailer URL (YouTube embed)</Form.Label>
              <Form.Control name="trailer" value={form.trailer} onChange={handleChange} className="bg-dark text-white border-secondary" />
            </Form.Group>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">The loai (cach nhau dau phay)</Form.Label>
                  <Form.Control name="genre" value={form.genre} onChange={handleChange} placeholder="Action, Drama" className="bg-dark text-white border-secondary" />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Rating</Form.Label>
                  <Form.Control type="number" step="0.1" name="rating" value={form.rating} onChange={handleChange} className="bg-dark text-white border-secondary" />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Thoi luong (phut)</Form.Label>
                  <Form.Control type="number" name="duration" value={form.duration} onChange={handleChange} className="bg-dark text-white border-secondary" />
                </Form.Group>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Ngay khoi chieu</Form.Label>
                  <Form.Control type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} className="bg-dark text-white border-secondary" />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Trang thai</Form.Label>
                  <Form.Select name="status" value={form.status} onChange={handleChange} className="bg-dark text-white border-secondary">
                    <option value="now_showing">Dang chieu</option>
                    <option value="coming_soon">Sap chieu</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Dao dien</Form.Label>
                  <Form.Control name="director" value={form.director} onChange={handleChange} className="bg-dark text-white border-secondary" />
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Dien vien (cach nhau dau phay)</Form.Label>
              <Form.Control name="cast" value={form.cast} onChange={handleChange} placeholder="Actor 1, Actor 2" className="bg-dark text-white border-secondary" />
            </Form.Group>
            <div className="d-flex gap-2 justify-content-end mt-4">
              <Button variant="secondary" onClick={handleClose}>Huy</Button>
              <Button variant="warning" type="submit" className="fw-bold text-dark">{editing ? 'Cap Nhat' : 'Them Phim'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminPage;
