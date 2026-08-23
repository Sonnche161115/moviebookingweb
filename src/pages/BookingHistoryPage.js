import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BookingHistoryPage = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:3001/bookings?userId=' + user.id)
        .then(res => { setBookings(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    } else setLoading(false);
  }, [user]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>;

  return (
    <Container className="pb-5">
      <h3 className="fw-bold text-white mb-4">Ve Da Dat</h3>
      {bookings.length === 0 ? (
        <Card className="bg-dark-card border-0 p-5 text-center rounded-3">
          <h5 className="text-white">Chua co ve nao</h5>
          <p className="text-secondary">Hay chon phim va dat ve ngay.</p>
        </Card>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {bookings.map(b => (
            <Col key={b.id}>
              <Card className="ticket-card border-0 rounded-3 h-100">
                <div className="ticket-header d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-0 text-white">{b.movieTitle}</h5>
                    <small className="text-secondary">{b.cinemaName}</small>
                  </div>
                  <Badge bg="warning" text="dark" className="px-3 py-2 fw-bold">Da thanh toan</Badge>
                </div>
                <Card.Body className="p-4 bg-dark-card text-light">
                  <div className="row g-2 mb-3 small">
                    <div className="col-6"><span className="text-secondary">Ngay:</span><br /><strong className="text-white">{b.date}</strong></div>
                    <div className="col-6"><span className="text-secondary">Suat:</span><br /><strong className="text-white">{b.time}</strong></div>
                    <div className="col-6 mt-2"><span className="text-secondary">Ghe:</span><br /><strong className="text-warning">{b.seats ? b.seats.join(', ') : ''}</strong></div>
                    <div className="col-6 mt-2"><span className="text-secondary">Tong tien:</span><br /><strong className="text-warning">{b.totalPrice ? b.totalPrice.toLocaleString() : 0} VND</strong></div>
                  </div>
                  <div className="bg-dark p-2 rounded-2 text-center small text-secondary border border-secondary">
                    Ma ve: <strong className="text-warning">#TICKET-{b.id}-{b.showtimeId}</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default BookingHistoryPage;
