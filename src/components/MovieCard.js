import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MovieCard = ({ movie, isAdmin, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleBookingClick = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/booking/' + movie.id);
    }
  };

  return (
    <Card className="movie-card h-100" style={{ cursor: 'pointer' }} onClick={() => navigate('/movie/' + movie.id)}>
      <Card.Img
        variant="top"
        src={movie.poster}
        alt={movie.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://picsum.photos/seed/' + movie.id + '/400/600';
        }}
      />
      <Card.Body className="p-2 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <strong className="text-truncate flex-grow-1 me-1" style={{ fontSize: '0.9rem' }} title={movie.title}>
            {movie.title}
          </strong>
          <span className="text-warning fw-bold small flex-shrink-0">★ {movie.rating}</span>
        </div>
        <small className="text-secondary mb-2 text-truncate">{movie.genre ? movie.genre.join(', ') : ''}</small>

        <div className="mt-auto">
          {isAdmin ? (
            <div className="d-flex gap-2">
              <Button
                variant="outline-warning"
                size="sm"
                className="w-50 fw-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(movie);
                }}
              >
                Sửa
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                className="w-50 fw-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(movie.id, movie.title);
                }}
              >
                Xóa
              </Button>
            </div>
          ) : (
            <Button
              variant="warning"
              size="sm"
              className="w-100 fw-bold"
              onClick={handleBookingClick}
            >
              Đặt Vé
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
