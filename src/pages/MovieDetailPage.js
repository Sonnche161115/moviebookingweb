import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Button, Spinner, Card } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/movies/' + id)
      .then(res => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>;
  if (!movie) return (
    <Container className="text-center py-5">
      <h4 className="text-white">Không Tìm Thấy Phim</h4>
      <Button as={Link} to="/" variant="warning" className="mt-3 fw-bold text-dark">Về Trang Chủ</Button>
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
                <Badge bg="warning" text="dark" className="fs-6 px-3 py-2 fw-bold">Điểm ★ {movie.rating}</Badge>
                {movie.genre && movie.genre.map((g, idx) => (
                  <Badge key={idx} bg="secondary" className="px-3 py-2">{g}</Badge>
                ))}
              </div>
              <h2 className="fw-bold text-white mb-3">{movie.title}</h2>
              <p className="text-secondary mb-4">{movie.description}</p>

              <div className="row g-3 mb-4 small text-light">
                <div className="col-6 col-md-4"><span className="text-secondary">Đạo diễn:</span><br /><strong className="text-white">{movie.director || 'N/A'}</strong></div>
                <div className="col-6 col-md-4"><span className="text-secondary">Thời lượng:</span><br /><strong className="text-white">{movie.duration} phút</strong></div>
                <div className="col-6 col-md-4"><span className="text-secondary">Khởi chiếu:</span><br /><strong className="text-white">{movie.releaseDate}</strong></div>
                <div className="col-12"><span className="text-secondary">Diễn viên chính:</span><br /><strong className="text-warning">{movie.cast ? movie.cast.join(', ') : 'N/A'}</strong></div>
              </div>
            </div>

            <div>
              {movie.status === 'now_showing' ? (
                <Button as={Link} to={'/booking/' + movie.id} variant="warning" size="lg" className="px-5 fw-bold text-dark w-100">
                  Đặt Vé Ngay
                </Button>
              ) : (
                <Button variant="secondary" size="lg" disabled className="px-5 fw-bold w-100">
                  Phim Sắp Chiếu
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
