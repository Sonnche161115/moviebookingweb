import React from 'react';

const SeatMap = ({ bookedSeats = [], selectedSeats = [], onSeatClick }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'occupied';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  return (
    <div className="text-center my-3">
      <div className="cinema-screen"></div>
      <small className="text-secondary d-block mb-3">Màn Hình</small>

      <div className="d-inline-block">
        {rows.map((row) => (
          <div key={row} className="d-flex justify-content-center align-items-center mb-1">
            <span className="text-secondary me-2 fw-bold" style={{ width: '15px' }}>{row}</span>
            {cols.map((col) => {
              const seatId = row + col;
              const status = getSeatStatus(seatId);
              return (
                <button
                  key={seatId}
                  disabled={status === 'occupied'}
                  className={'seat-btn ' + status}
                  onClick={() => onSeatClick(seatId)}
                >
                  {col}
                </button>
              );
            })}
            <span className="text-secondary ms-2 fw-bold" style={{ width: '15px' }}>{row}</span>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center gap-3 mt-3 small text-secondary">
        <div><span className="d-inline-block seat-btn" style={{ width: '16px', height: '16px' }}></span> Trống</div>
        <div><span className="d-inline-block seat-btn selected" style={{ width: '16px', height: '16px' }}></span> Đang Chọn</div>
        <div><span className="d-inline-block seat-btn occupied" style={{ width: '16px', height: '16px' }}></span>Đã Bán</div>
      </div>
    </div>
  );
};

export default SeatMap;
