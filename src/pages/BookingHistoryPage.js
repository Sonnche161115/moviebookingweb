import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row, Col, Badge, Button, Spinner, Form } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BookingHistoryPage = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSearch, setFilterSearch] = useState('');

  useEffect(() => {
    fetchBookingsData();
  }, [user]);

  const fetchBookingsData = () => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (isAdmin()) {
      // Admin: Lấy toàn bộ vé của tất cả khách hàng
      Promise.all([
        axios.get('http://localhost:3001/bookings'),
        axios.get('http://localhost:3001/users')
      ])
        .then(([bookingsRes, usersRes]) => {
          setBookings(bookingsRes.data);
          setUsersList(usersRes.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      // User thường: Chỉ lấy vé của chính mình
      axios.get('http://localhost:3001/bookings?userId=' + user.id)
        .then(res => {
          setBookings(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  const getUserInfo = (userId) => {
    const found = usersList.find(u => u.id === userId);
    return found ? `${found.name} (${found.email})` : `Khách #${userId}`;
  };

  const handleCancelBooking = (booking) => {
    const confirmMsg = isAdmin()
      ? `Bạn có chắc muốn hủy/xóa vé của phim "${booking.movieTitle}" (Ghế: ${booking.seats.join(', ')})?`
      : `Bạn có chắc chắn muốn hủy vé xem phim "${booking.movieTitle}" (Ghế: ${booking.seats.join(', ')})?`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    // 1. Trả lại ghế trống trong showtimes
    axios.get('http://localhost:3001/showtimes/' + booking.showtimeId)
      .then(res => {
        const showtime = res.data;
        const remainingSeats = showtime.bookedSeats.filter(seat => !booking.seats.includes(seat));
        return axios.patch('http://localhost:3001/showtimes/' + booking.showtimeId, {
          bookedSeats: remainingSeats
        });
      })
      .then(() => {
        // 2. Xóa vé trong bookings
        return axios.delete('http://localhost:3001/bookings/' + booking.id);
      })
      .then(() => {
        alert(isAdmin() ? 'Đã hủy và xóa vé thành công!' : 'Hủy vé thành công!');
        fetchBookingsData();
      })
      .catch(err => {
        console.error(err);
        alert('Có lỗi xảy ra khi hủy vé!');
      });
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>;

  const filteredBookings = bookings.filter(b => {
    const search = filterSearch.toLowerCase();
    const movieMatch = b.movieTitle ? b.movieTitle.toLowerCase().includes(search) : false;
    const cinemaMatch = b.cinemaName ? b.cinemaName.toLowerCase().includes(search) : false;
    const seatMatch = b.seats ? b.seats.join(', ').toLowerCase().includes(search) : false;
    const codeMatch = b.id ? b.id.toString().includes(search) : false;
    return movieMatch || cinemaMatch || seatMatch || codeMatch;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalSeatsSold = bookings.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);

  return (
    <Container className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold text-white mb-1">
            {isAdmin() ? 'Quản Lý Tất Cả Vé Đã Đặt' : 'Vé Đã Đặt Của Tôi'}
          </h4>
          {isAdmin() && (
            <small className="text-secondary">
              Danh sách toàn bộ các vé và ghế ngồi đã được khách hàng đặt trên hệ thống.
            </small>
          )}
        </div>

        {isAdmin() && (
          <Form.Control
            type="text"
            size="sm"
            placeholder="Tìm theo tên phim, rạp, ghế, mã vé..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            style={{ width: '280px', backgroundColor: '#222', color: '#fff', borderColor: '#444' }}
          />
        )}
      </div>

      {/* Thống kê nhanh cho Quản trị viên */}
      {isAdmin() && (
        <Row className="g-3 mb-4">
          <Col sm={4}>
            <Card className="card-dark p-3 text-center">
              <span className="text-secondary small">Tổng số vé đã đặt</span>
              <h4 className="fw-bold text-white mb-0">{bookings.length} đơn</h4>
            </Card>
          </Col>
          <Col sm={4}>
            <Card className="card-dark p-3 text-center">
              <span className="text-secondary small">Tổng số ghế đã bán</span>
              <h4 className="fw-bold text-warning mb-0">{totalSeatsSold} ghế</h4>
            </Card>
          </Col>
          <Col sm={4}>
            <Card className="card-dark p-3 text-center">
              <span className="text-secondary small">Tổng doanh thu</span>
              <h4 className="fw-bold text-success mb-0">{totalRevenue.toLocaleString()} VNĐ</h4>
            </Card>
          </Col>
        </Row>
      )}

      {filteredBookings.length === 0 ? (
        <Card className="card-dark p-5 text-center">
          <h5 className="text-white">
            {isAdmin() ? 'Hiện chưa có vé nào trong hệ thống' : 'Bạn chưa đặt vé nào'}
          </h5>
          <p className="text-secondary mb-0">
            {isAdmin() ? 'Khi khách hàng đặt vé, thông tin chi tiết sẽ hiển thị tại đây.' : 'Hãy chọn một bộ phim yêu thích và đặt vé ngay nhé.'}
          </p>
        </Card>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {filteredBookings.map(b => (
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
                  {isAdmin() && (
                    <div className="mb-2 p-2 rounded bg-dark border border-secondary small">
                      <span className="text-secondary">Người đặt: </span>
                      <strong className="text-warning">{getUserInfo(b.userId)}</strong>
                    </div>
                  )}

                  <div className="row g-2 mb-3 small">
                    <div className="col-6"><span className="text-secondary">Ngày chiếu:</span><br /><strong className="text-white">{b.date}</strong></div>
                    <div className="col-6"><span className="text-secondary">Suất chiếu:</span><br /><strong className="text-white">{b.time}</strong></div>
                    <div className="col-6 mt-2"><span className="text-secondary">Ghế đã đặt:</span><br /><strong className="text-warning">{b.seats ? b.seats.join(', ') : ''}</strong></div>
                    <div className="col-6 mt-2"><span className="text-secondary">Tổng tiền:</span><br /><strong className="text-warning">{b.totalPrice ? b.totalPrice.toLocaleString() : 0} VNĐ</strong></div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center bg-dark p-2 rounded border border-secondary">
                    <small className="text-secondary">Mã vé: <strong className="text-warning">#TICKET-{b.id}</strong></small>
                    <Button variant="outline-danger" size="sm" onClick={() => handleCancelBooking(b)}>
                      {isAdmin() ? 'Hủy / Xóa Vé' : 'Hủy Vé'}
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
