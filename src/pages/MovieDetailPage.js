import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Badge, Button, Spinner, Card, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MovieDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userScore, setUserScore] = useState(10);
  const [hasRated, setHasRated] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = () => {
    axios.get('http://localhost:3001/movies/' + id)
      .then(res => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleRateSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    // Calculate new average rating
    const currentRating = parseFloat(movie.rating) || 8.0;
    const newRating = parseFloat(((currentRating * 10 + userScore) / 11).toFixed(1));

    axios.patch('http://localhost:3001/movies/' + movie.id, {
      rating: newRating
    })
      .then(() => {
        setMovie({ ...movie, rating: newRating });
        setHasRated(true);
        setRatingMessage('Cam on ban da danh gia ' + userScore + '/10 sao cho phim nay!');
      })
      .catch(() => {
        alert('Co loi xay ra khi gui danh gia!');
      });
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>;
  if (!movie) return (
    <Container className="text-center py-5">
      <h4 className="text-white">Khong tim thay phim</h4>
      <Button as={Link} to="/" variant="warning" className="mt-3 fw-bold text-dark">Ve trang chu</Button>
    </Container>
  );

  return (
    <Container className="pb-5">
      <Card className="card-dark p-3 mb-4">
        <Row className="g-0">
          <Col md={4} className="p-2">
            <img src={movie.poster} alt={movie.title} className="img-fluid rounded w-100" style={{ maxHeight: '420px', objectFit: 'cover' }} />
          </Col>
          <Col md={8} className="p-4 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <Badge bg="warning" text="dark" className="fs-6 px-3 py-2 fw-bold">IMDb ★ {movie.rating}</Badge>
                {movie.genre && movie.genre.map((g, idx) => (
                  <Badge key={idx} bg="secondary" className="px-3 py-2">{g}</Badge>
                ))}
              </div>
              <h2 className="fw-bold text-white mb-3">{movie.title}</h2>
              <p className="text-secondary mb-4">{movie.description}</p>
              
              <div className="row g-3 mb-4 small text-light">
                <div className="col-6 col-md-4"><span className="text-secondary">Dao dien:</span><br /><strong className="text-white">{movie.director || 'N/A'}</strong></div>
                <div className="col-6 col-md-4"><span className="text-secondary">Thoi luong:</span><br /><strong className="text-white">{movie.duration} phut</strong></div>
                <div className="col-6 col-md-4"><span className="text-secondary">Khoi chieu:</span><br /><strong className="text-white">{movie.releaseDate}</strong></div>
                <div className="col-12"><span className="text-secondary">Dien vien:</span><br /><strong className="text-warning">{movie.cast ? movie.cast.join(', ') : 'N/A'}</strong></div>
              </div>
            </div>

            <div>
              {/* User Rating Box */}
              <div className="p-3 mb-3 rounded bg-dark border border-secondary">
                <h6 className="fw-bold text-warning mb-2">★ Danh gia phim nay</h6>
                {user ? (
                  hasRated ? (
                    <div className="text-success small fw-bold">{ratingMessage}</div>
                  ) : (
                    <Form onSubmit={handleRateSubmit} className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="small text-light">Chon diem:</span>
                      <Form.Select
                        size="sm"
                        value={userScore}
                        onChange={(e) => setUserScore(parseInt(e.target.value))}
                        style={{ width: '100px', backgroundColor: '#222', color: '#fff', borderColor: '#555' }}
                      >
                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(score => (
                          <option key={score} value={score}>{score} sao ★</option>
                        ))}
                      </Form.Select>
                      <Button type="submit" variant="warning" size="sm" className="fw-bold">
                        Gui danh gia
                      </Button>
                    </Form>
                  )
                ) : (
                  <small className="text-secondary">
                    Vui long <Link to="/login" className="text-warning fw-bold text-decoration-none">Dang nhap</Link> de danh gia phim.
                  </small>
                )}
              </div>

              {movie.status === 'now_showing' ? (
                <Button as={Link} to={'/booking/' + movie.id} variant="warning" size="lg" className="px-5 fw-bold text-dark w-100">
                  Dat Ve Ngay
                </Button>
              ) : (
                <Button variant="secondary" size="lg" disabled className="px-5 fw-bold w-100">
                  Sap Chieu
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {movie.trailer && (
        <div className="card-dark p-4">
          <h5 className="fw-bold text-warning mb-3">Trailer Phim</h5>
          <div className="ratio ratio-16x9 rounded overflow-hidden">
            <iframe src={movie.trailer} title={movie.title} allowFullScreen></iframe>
          </div>
        </div>
      )}
    </Container>
  );
};

export default MovieDetailPage;
