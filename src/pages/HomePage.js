import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, ButtonGroup, Button, Spinner } from 'react-bootstrap';
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
      (movie.genre && movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())));
    if (activeTab === 'now_showing') return matchesSearch && movie.status === 'now_showing';
    if (activeTab === 'coming_soon') return matchesSearch && movie.status === 'coming_soon';
    return matchesSearch;
  });

  return (
    <Container className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="fw-bold text-white mb-0">Danh sach phim</h4>
        <div className="d-flex gap-2">
          <ButtonGroup size="sm">
            <Button variant={activeTab === 'all' ? 'warning' : 'outline-secondary'} onClick={() => setActiveTab('all')}>
              Tat ca ({movies.length})
            </Button>
            <Button variant={activeTab === 'now_showing' ? 'warning' : 'outline-secondary'} onClick={() => setActiveTab('now_showing')}>
              Dang chieu
            </Button>
            <Button variant={activeTab === 'coming_soon' ? 'warning' : 'outline-secondary'} onClick={() => setActiveTab('coming_soon')}>
              Sap chieu
            </Button>
          </ButtonGroup>
          <Form.Control
            type="text"
            size="sm"
            placeholder="Tim kiem phim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '180px', backgroundColor: '#222', color: '#fff', borderColor: '#444' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-5 text-secondary">Khong tim thay phim phu hop.</div>
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
