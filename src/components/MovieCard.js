import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, isAdmin, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Card className="movie-card h-100" style={{ cursor: 'pointer' }} onClick={() => navigate('/movie/' + movie.id)}>
      <Card.Img variant="top" src={movie.poster} alt={movie.title} />
      <Card.Body className="p-2 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <strong className="text-truncate flex-grow-1 me-1" style={{ fontSize: '0.9rem' }} title={movie.title}>
            {movie.title}
          </strong>
          <span className="text-warning fw-bold small flex-shrink-0">★ {movie.rating}</span>
        </div>
        <small className="text-secondary mb-2 text-truncate">{movie.genre ? movie.genre.join(', ') : ''}</small>
        
        <div className="mt-auto d-grid gap-1">
          <Button
            variant="warning"
            size="sm"
            className="w-100 fw-bold"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/booking/' + movie.id);
            }}
          >
            Dat ve
          </Button>

          {isAdmin && (
            <div className="d-flex gap-1 mt-1">
              <Button
                variant="outline-warning"
                size="sm"
                className="w-50 py-0"
                style={{ fontSize: '0.75rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(movie);
                }}
              >
                Sua
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                className="w-50 py-0"
                style={{ fontSize: '0.75rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(movie.id, movie.title);
                }}
              >
                Xoa
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
