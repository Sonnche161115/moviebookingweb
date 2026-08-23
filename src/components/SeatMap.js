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
      <div className="cinema-screen-container">
        <div className="cinema-screen"></div>
        <div className="cinema-screen-text">Man hinh</div>
      </div>
      <div className="d-inline-block">
        {rows.map((row) => (
          <div key={row} className="d-flex justify-content-center align-items-center mb-1">
            <span className="fw-bold text-muted me-2" style={{ width: '18px' }}>{row}</span>
            {cols.map((col) => {
              const seatId = row + '' + col;
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
            <span className="fw-bold text-muted ms-2" style={{ width: '18px' }}>{row}</span>
          </div>
        ))}
      </div>
      <div className="seat-legend">
        <div className="legend-item"><div className="legend-box available"></div><span>Trong</span></div>
        <div className="legend-item"><div className="legend-box selected"></div><span>Dang chon</span></div>
        <div className="legend-item"><div className="legend-box occupied"></div><span>Da ban</span></div>
      </div>
    </div>
  );
};

export default SeatMap;
