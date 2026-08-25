import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SeatMap from '../components/SeatMap';
import { AuthContext } from '../context/AuthContext';

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Chuyển hướng về đăng nhập ngay nếu chưa đăng nhập
    if (!user) {
      navigate('/login');
      return;
    }

    Promise.all([
      axios.get('http://localhost:3001/movies/' + movieId),
      axios.get('http://localhost:3001/showtimes?movieId=' + movieId)
    ])
      .then(([movieRes, showtimeRes]) => {
        setMovie(movieRes.data);
        setShowtimes(showtimeRes.data);
        if (showtimeRes.data.length > 0) {
          setSelectedShowtime(showtimeRes.data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [movieId, user, navigate]);

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedShowtime) {
      setError('Vui lòng chọn một suất chiếu!');
      return;
    }
    if (selectedSeats.length === 0) {
      setError('Vui lòng chọn ít nhất 1 ghế ngồi!');
      return;
    }

    setSubmitting(true);
    setError('');
    const totalPrice = selectedSeats.length * selectedShowtime.price;
    const bookingData = {
      userId: user.id,
      showtimeId: selectedShowtime.id,
      movieId: movie.id,
      movieTitle: movie.title,
      date: selectedShowtime.date,
      time: selectedShowtime.time,
      seats: selectedSeats,
      totalPrice: totalPrice,
      bookingDate: new Date().toISOString()
    };

    axios.post('http://localhost:3001/bookings', bookingData)
      .then(() => {
        const updated = [...selectedShowtime.bookedSeats, ...selectedSeats];
        return axios.patch('http://localhost:3001/showtimes/' + selectedShowtime.id, {
          bookedSeats: updated
        });
      })
      .then(() => {
        setSubmitting(false);
        alert('🎉 Đặt vé thành công!');
        navigate('/history');
      })
      .catch(err => {
        console.error(err);
        setError('Có lỗi xảy ra, vui lòng thử lại!');
        setSubmitting(false);
      });
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>;

  return (
    <Container className="pb-5">
      <h3 className="fw-bold text-white mb-4">Đặt Vé: <span className="text-warning">{movie.title}</span></h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="card-dark p-4 mb-4">
            <h5 className="fw-bold text-warning mb-3">1. Chọn Suất Chiếu</h5>
            {showtimes.length === 0 ? (
              <p className="text-secondary mb-0">Hiện chưa có suất chiếu cho phim này.</p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {showtimes.map(st => (
                  <Button
                    key={st.id}
                    variant={selectedShowtime && selectedShowtime.id === st.id ? 'warning' : 'outline-warning'}
                    className="px-4 py-2 fw-bold"
                    onClick={() => {
                      setSelectedShowtime(st);
                      setSelectedSeats([]);
                    }}
                  >
                    {st.date} ({st.time}) - {st.price.toLocaleString()} VNĐ
                  </Button>
                ))}
              </div>
            )}
          </Card>

          {selectedShowtime && (
            <Card className="card-dark p-4">
              <h5 className="fw-bold text-warning mb-2">2. Chọn Ghế Ngồi</h5>
              <SeatMap
                bookedSeats={selectedShowtime.bookedSeats}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
              />
            </Card>
          )}
        </Col>

        <Col lg={4}>
          <Card className="card-dark p-4 sticky-top" style={{ top: '80px' }}>
            <h5 className="fw-bold text-warning mb-3">Thông Tin Đặt Vé</h5>
            <div className="d-flex gap-3 mb-3">
              <img src={movie.poster} alt={movie.title} className="rounded" style={{ width: '60px', height: '85px', objectFit: 'cover' }} />
              <div>
                <h6 className="fw-bold text-white mb-1">{movie.title}</h6>
                <small className="text-warning">★ {movie.rating} | {movie.duration} phút</small>
              </div>
            </div>
            <hr className="border-secondary" />
            <div className="small mb-2 text-light">
              <span className="text-secondary">Ngày chiếu:</span> {selectedShowtime ? selectedShowtime.date : '-'}
            </div>
            <div className="small mb-2 text-light">
              <span className="text-secondary">Giờ chiếu:</span> {selectedShowtime ? selectedShowtime.time : '-'}
            </div>
            <div className="small mb-3 text-light">
              <span className="text-secondary">Ghế đã chọn:</span>{' '}
              <span className="text-warning fw-bold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span>
            </div>
            <hr className="border-secondary" />
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-secondary">Tổng thanh toán:</span>
              <h4 className="fw-bold text-warning mb-0">
                {selectedShowtime ? (selectedSeats.length * selectedShowtime.price).toLocaleString() : 0} VNĐ
              </h4>
            </div>
            <Button
              variant="warning"
              size="lg"
              className="w-100 fw-bold text-dark"
              disabled={submitting || !selectedShowtime || selectedSeats.length === 0}
              onClick={handleConfirmBooking}
            >
              {submitting ? <Spinner animation="border" size="sm" /> : 'Xác Nhận Đặt Vé'}
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;
