import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row, Col, Badge, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BookingHistoryPage = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = () => {
    if (user) {
      axios.get('http://localhost:3001/bookings?userId=' + user.id)
        .then(res => { setBookings(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  const handleCancelBooking = (booking) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy vé xem phim "' + booking.movieTitle + '" (Ghế: ' + booking.seats.join(', ') + ')?')) {
      return;
    }

    axios.get('http://localhost:3001/showtimes/' + booking.showtimeId)
      .then(res => {
        const showtime = res.data;
        const remainingSeats = showtime.bookedSeats.filter(seat => !booking.seats.includes(seat));
        return axios.patch('http://localhost:3001/showtimes/' + booking.showtimeId, {
          bookedSeats: remainingSeats
        });
      })
      .then(() => {
        return axios.delete('http://localhost:3001/bookings/' + booking.id);
      })
      .then(() => {
        alert('Hủy vé thành công!');
        fetchBookings();
      })
      .catch(err => {
        console.error(err);
        alert('Có lỗi xảy ra khi hủy vé!');
      });
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>;

  return (
    <Container className="pb-5">
      <h4 className="fw-bold text-white mb-4">Vé Đã Đặt Của Tôi</h4>
      {bookings.length === 0 ? (
        <Card className="card-dark p-5 text-center">
          <h5 className="text-white">Bạn chưa đặt vé nào</h5>
          <p className="text-secondary mb-0">Hãy chọn một bộ phim yêu thích và đặt vé ngay nhé.</p>
        </Card>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {bookings.map(b => (
            <Col key={b.id}>
              <Card className="card-dark h-100">
                <Card.Header className="d-flex justify-content-between align-items-center bg-dark border-secondary">
                  <div>
                    <h6 className="fw-bold text-white mb-0">{b.movieTitle}</h6>
                    <small className="text-secondary">{b.cinemaName}</small>
                  </div>
                  <Badge bg="success">Đã Thanh Toán</Badge>
                </Card.Header>
                <Card.Body className="p-3 text-light">
                  <div className="row g-2 mb-3 small">
                    <div className="col-6"><span className="text-secondary">Ngày chiếu:</span><br /><strong className="text-white">{b.date}</strong></div>
                    <div className="col-6"><span className="text-secondary">Suất chiếu:</span><br /><strong className="text-white">{b.time}</strong></div>
                    <div className="col-6 mt-2"><span className="text-secondary">Ghế đã đặt:</span><br /><strong className="text-warning">{b.seats ? b.seats.join(', ') : ''}</strong></div>
                    <div className="col-6 mt-2"><span className="text-secondary">Tổng tiền:</span><br /><strong className="text-warning">{b.totalPrice ? b.totalPrice.toLocaleString() : 0} VNĐ</strong></div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center bg-dark p-2 rounded border border-secondary">
                    <small className="text-secondary">Mã vé: <strong className="text-warning">#TICKET-{b.id}</strong></small>
                    <Button variant="outline-danger" size="sm" onClick={() => handleCancelBooking(b)}>
                      Hủy Vé
                    </Button>
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
