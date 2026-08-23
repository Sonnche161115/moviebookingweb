import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <Card className="movie-card h-100" style={{ cursor: 'pointer' }} onClick={() => navigate('/movie/' + movie.id)}>
      <div className="poster-container">
        <Card.Img variant="top" src={movie.poster} alt={movie.title} className="poster-img" />
        <div className="rating-badge">{movie.rating}</div>
      </div>
      <Card.Body className="d-flex flex-column p-3">
        <Card.Title className="fw-bold fs-6 mb-2 text-truncate text-white" title={movie.title}>
          {movie.title}
        </Card.Title>
        <div className="d-flex flex-wrap gap-1 mb-2">
          {movie.genre && movie.genre.map((g, idx) => (
            <span key={idx} className="genre-pill">{g}</span>
          ))}
        </div>
        <Card.Text className="text-secondary small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {movie.description}
        </Card.Text>
        <div className="d-grid mt-auto">
          <Button variant="warning" size="sm" className="fw-bold text-dark" onClick={(e) => { e.stopPropagation(); navigate('/booking/' + movie.id); }}>
            Dat ve
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
