import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Nav, Spinner } from 'react-bootstrap';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    axios.get('http://localhost:3001/movies')
      .then(res => { setMovies(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));
    if (activeTab === 'now_showing') return matchesSearch && movie.status === 'now_showing';
    if (activeTab === 'coming_soon') return matchesSearch && movie.status === 'coming_soon';
    return matchesSearch;
  });

  return (
    <Container className="pb-5">
      <div className="hero-banner">
        <span className="badge bg-warning text-dark mb-2 px-3 py-2 fw-bold">IMDb Top 10</span>
        <h1 className="fw-bold text-white mb-2">Phim Hay Nhat Moi Thoi Dai</h1>
        <p className="text-secondary mb-0">Dat ve xem phim truc tuyen voi cac kiet tac IMDb.</p>
      </div>

      <Row className="align-items-center mb-4 g-3">
        <Col md={6}>
          <Nav variant="pills" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item><Nav.Link eventKey="all" className="px-3 me-2 fw-bold">Tat ca ({movies.length})</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="now_showing" className="px-3 me-2 fw-bold">Dang chieu</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="coming_soon" className="px-3 fw-bold">Sap chieu</Nav.Link></Nav.Item>
          </Nav>
        </Col>
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Tim ten phim, the loai..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="imdb-search-input px-3"
            />
          </InputGroup>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-5 bg-dark-card rounded-3">
          <h5 className="text-white">Khong tim thay phim phu hop</h5>
        </div>
      ) : (
        <div className="movie-grid">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default HomePage;
