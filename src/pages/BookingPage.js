import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SeatMap from '../components/SeatMap';
import { AuthContext } from '../context/AuthContext';

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:3001/movies/' + movieId),
      axios.get('http://localhost:3001/cinemas'),
      axios.get('http://localhost:3001/showtimes?movieId=' + movieId)
    ]).then(([movieRes, cinemaRes, showtimeRes]) => {
      setMovie(movieRes.data);
      setCinemas(cinemaRes.data);
      setShowtimes(showtimeRes.data);
      if (cinemaRes.data.length > 0) setSelectedCinema(cinemaRes.data[0].id.toString());
      setLoading(false);
    }).catch(err => { console.error(err); setLoading(false); });
  }, [movieId]);

  const availableShowtimes = showtimes.filter(s => s.cinemaId.toString() === selectedCinema);

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    else setSelectedSeats([...selectedSeats, seatId]);
  };

  const handleConfirmBooking = () => {
    if (!user) { alert('Vui long dang nhap de dat ve!'); navigate('/login'); return; }
    if (!selectedShowtime) { setError('Vui long chon suat chieu!'); return; }
    if (selectedSeats.length === 0) { setError('Vui long chon it nhat 1 ghe!'); return; }
    setSubmitting(true);
    setError('');
    const chosenCinema = cinemas.find(c => c.id.toString() === selectedCinema);
    const totalPrice = selectedSeats.length * selectedShowtime.price;
    const bookingData = {
      userId: user.id, showtimeId: selectedShowtime.id, movieId: movie.id,
      movieTitle: movie.title, cinemaName: chosenCinema ? chosenCinema.name : '',
      date: selectedShowtime.date, time: selectedShowtime.time,
      seats: selectedSeats, totalPrice: totalPrice, bookingDate: new Date().toISOString()
    };
    axios.post('http://localhost:3001/bookings', bookingData)
      .then(() => {
        const updated = [...selectedShowtime.bookedSeats, ...selectedSeats];
        return axios.patch('http://localhost:3001/showtimes/' + selectedShowtime.id, { bookedSeats: updated });
      })
      .then(() => { setSubmitting(false); alert('Dat ve thanh cong!'); navigate('/history'); })
      .catch(err => { console.error(err); setError('Co loi xay ra, vui long thu lai!'); setSubmitting(false); });
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>;

  return (
    <Container className="pb-5">
      <h3 className="fw-bold text-white mb-4">Dat Ve: <span className="text-warning">{movie.title}</span></h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="bg-dark-card p-4 mb-4 rounded-3">
            <h5 className="fw-bold text-warning mb-3">1. Chon Rap</h5>
            <Form.Select value={selectedCinema} onChange={(e) => { setSelectedCinema(e.target.value); setSelectedShowtime(null); setSelectedSeats([]); }} className="bg-dark text-white border-secondary py-2">
              {cinemas.map(c => <option key={c.id} value={c.id}>{c.name} ({c.location})</option>)}
            </Form.Select>
          </Card>
          <Card className="bg-dark-card p-4 mb-4 rounded-3">
            <h5 className="fw-bold text-warning mb-3">2. Chon Suat Chieu</h5>
            {availableShowtimes.length === 0 ? (
              <p className="text-secondary mb-0">Khong co suat chieu tai rap nay.</p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {availableShowtimes.map(st => (
                  <Button key={st.id} variant={selectedShowtime && selectedShowtime.id === st.id ? 'warning' : 'outline-warning'} className="px-4 py-2 fw-bold"
                    onClick={() => { setSelectedShowtime(st); setSelectedSeats([]); }}>
                    {st.time} ({st.price.toLocaleString()}d)
                  </Button>
                ))}
              </div>
            )}
          </Card>
          {selectedShowtime && (
            <Card className="bg-dark-card p-4 rounded-3">
              <h5 className="fw-bold text-warning mb-2">3. Chon Ghe</h5>
              <SeatMap bookedSeats={selectedShowtime.bookedSeats} selectedSeats={selectedSeats} onSeatClick={handleSeatClick} />
            </Card>
          )}
        </Col>
        <Col lg={4}>
          <Card className="bg-dark-card p-4 sticky-top rounded-3" style={{ top: '80px' }}>
            <h5 className="fw-bold text-warning mb-3">Thong Tin Ve</h5>
            <div className="d-flex gap-3 mb-3">
              <img src={movie.poster} alt={movie.title} className="rounded-2" style={{ width: '60px', height: '85px', objectFit: 'cover' }} />
              <div>
                <h6 className="fw-bold text-white mb-1">{movie.title}</h6>
                <small className="text-warning">IMDb {movie.rating} | {movie.duration}m</small>
              </div>
            </div>
            <hr className="border-secondary" />
            <div className="small mb-2 text-light"><span className="text-secondary">Rap:</span> {cinemas.find(c => c.id.toString() === selectedCinema)?.name || '-'}</div>
            <div className="small mb-2 text-light"><span className="text-secondary">Suat:</span> {selectedShowtime ? selectedShowtime.date + ' | ' + selectedShowtime.time : '-'}</div>
            <div className="small mb-3 text-light"><span className="text-secondary">Ghe:</span> <span className="text-warning fw-bold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span></div>
            <hr className="border-secondary" />
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-secondary">Tong tien:</span>
              <h4 className="fw-bold text-warning mb-0">{selectedShowtime ? (selectedSeats.length * selectedShowtime.price).toLocaleString() : 0} VND</h4>
            </div>
            <Button variant="warning" size="lg" className="w-100 fw-bold text-dark" disabled={submitting || !selectedShowtime || selectedSeats.length === 0} onClick={handleConfirmBooking}>
              {submitting ? <Spinner animation="border" size="sm" /> : 'Xac Nhan Dat Ve'}
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;
