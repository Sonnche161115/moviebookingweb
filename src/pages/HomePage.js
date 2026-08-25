import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, ButtonGroup, Button, Spinner, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { isAdmin } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [modalError, setModalError] = useState('');
  const [form, setForm] = useState({
    title: '', poster: '', description: '', trailer: '',
    genre: '', rating: '', duration: '', releaseDate: '',
    status: 'now_showing', director: '', cast: ''
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    axios.get('http://localhost:3001/movies')
      .then(res => { setMovies(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movie.genre && movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())));
    if (activeTab === 'now_showing') return matchesSearch && movie.status === 'now_showing';
    if (activeTab === 'coming_soon') return matchesSearch && movie.status === 'coming_soon';
    return matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditing(null);
    setForm({
      title: '', poster: '', description: '', trailer: '',
      genre: '', rating: '8.0', duration: '120', releaseDate: '2026-08-25',
      status: 'now_showing', director: '', cast: ''
    });
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEdit = (movie) => {
    setEditing(movie.id);
    setForm({
      title: movie.title, poster: movie.poster, description: movie.description,
      trailer: movie.trailer || '', genre: movie.genre ? movie.genre.join(', ') : '',
      rating: movie.rating, duration: movie.duration, releaseDate: movie.releaseDate,
      status: movie.status, director: movie.director || '', cast: movie.cast ? movie.cast.join(', ') : ''
    });
    setModalError('');
    setShowModal(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim "' + title + '"?')) {
      axios.delete('http://localhost:3001/movies/' + id)
        .then(() => fetchMovies())
        .catch(() => alert('Có lỗi xảy ra khi xóa phim!'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.poster) {
      setModalError('Vui lòng nhập tên phim và link poster!');
      return;
    }
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
        .then(() => { fetchMovies(); setShowModal(false); })
        .catch(() => setModalError('Lỗi khi cập nhật phim!'));
    } else {
      axios.post('http://localhost:3001/movies', movieData)
        .then(() => { fetchMovies(); setShowModal(false); })
        .catch(() => setModalError('Lỗi khi thêm phim!'));
    }
  };

  return (
    <Container className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <h4 className="fw-bold text-white mb-0">Danh Sách Phim</h4>
          {isAdmin() && (
            <Button variant="warning" size="sm" className="fw-bold" onClick={handleOpenAdd}>
              + Thêm Phim Mới
            </Button>
          )}
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <ButtonGroup size="sm">
            <Button variant={activeTab === 'all' ? 'warning' : 'outline-secondary'} onClick={() => setActiveTab('all')}>
              Tất Cả ({movies.length})
            </Button>
            <Button variant={activeTab === 'now_showing' ? 'warning' : 'outline-secondary'} onClick={() => setActiveTab('now_showing')}>
              Đang Chiếu
            </Button>
            <Button variant={activeTab === 'coming_soon' ? 'warning' : 'outline-secondary'} onClick={() => setActiveTab('coming_soon')}>
              Sắp Chiếu
            </Button>
          </ButtonGroup>
          <Form.Control
            type="text"
            size="sm"
            placeholder="Tìm kiếm phim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '180px', backgroundColor: '#222', color: '#fff', borderColor: '#444' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-5 text-secondary">Không tìm thấy phim phù hợp.</div>
      ) : (
        <div className="movie-grid">
          {filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isAdmin={isAdmin()}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal Thêm / Sửa Phim */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton className="border-secondary">
          <Modal.Title className="text-warning fw-bold">{editing ? 'Sửa Thông Tin Phim' : 'Thêm Phim Mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Tên Phim</Form.Label>
              <Form.Control name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-dark text-white border-secondary" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Link Poster (Ảnh)</Form.Label>
              <Form.Control name="poster" value={form.poster} onChange={(e) => setForm({ ...form, poster: e.target.value })} required className="bg-dark text-white border-secondary" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Mô Tả Phim</Form.Label>
              <Form.Control as="textarea" rows={2} name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-dark text-white border-secondary" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Link Trailer (YouTube Embed)</Form.Label>
              <Form.Control name="trailer" value={form.trailer} onChange={(e) => setForm({ ...form, trailer: e.target.value })} className="bg-dark text-white border-secondary" />
            </Form.Group>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Thể Loại (Ví dụ: Hành Động, Kịch Tính)</Form.Label>
                  <Form.Control name="genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="bg-dark text-white border-secondary" />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Điểm Đánh Giá</Form.Label>
                  <Form.Control type="number" step="0.1" name="rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="bg-dark text-white border-secondary" />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Thời Lượng (Phút)</Form.Label>
                  <Form.Control type="number" name="duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="bg-dark text-white border-secondary" />
                </Form.Group>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Ngày Khởi Chiếu</Form.Label>
                  <Form.Control type="date" name="releaseDate" value={form.releaseDate} onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} className="bg-dark text-white border-secondary" />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Trạng Thái</Form.Label>
                  <Form.Select name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-dark text-white border-secondary">
                    <option value="now_showing">Đang Chiếu</option>
                    <option value="coming_soon">Sắp Chiếu</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Đạo Diễn</Form.Label>
                  <Form.Control name="director" value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} className="bg-dark text-white border-secondary" />
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Diễn Viên (Cách nhau dấu phẩy)</Form.Label>
              <Form.Control name="cast" value={form.cast} onChange={(e) => setForm({ ...form, cast: e.target.value })} placeholder="Diễn viên 1, Diễn viên 2" className="bg-dark text-white border-secondary" />
            </Form.Group>
            <div className="d-flex gap-2 justify-content-end mt-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
              <Button variant="warning" type="submit" className="fw-bold text-dark">{editing ? 'Lưu Thay Đổi' : 'Thêm Phim'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default HomePage;
