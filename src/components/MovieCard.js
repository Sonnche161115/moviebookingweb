import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <Card className="movie-card h-100" style={{ cursor: 'pointer' }} onClick={() => navigate('/movie/' + movie.id)}>
      <Card.Img variant="top" src={movie.poster} alt={movie.title} />
      <Card.Body className="p-2 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <strong className="text-truncate" style={{ fontSize: '0.9rem' }} title={movie.title}>
            {movie.title}
          </strong>
          <span className="text-warning fw-bold small">★ {movie.rating}</span>
        </div>
        <small className="text-secondary mb-2">{movie.genre ? movie.genre.join(', ') : ''}</small>
        <Button
          variant="warning"
          size="sm"
          className="mt-auto w-100"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/booking/' + movie.id);
          }}
        >
          Dat ve
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
