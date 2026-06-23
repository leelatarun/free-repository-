export default function Seat({ seatNumber, seatData, isSelected, onSelect }) {
  const bookings = seatData?.bookings || [];
  const isBooked = bookings.length > 0;
  const section = seatData?.section || (seatNumber <= 58 ? 'AC' : 'NON_AC');

  let className;
  let title;

  if (isBooked) {
    className = 'seat-booked';
    title = `Seat ${seatNumber} – Booked`;
  } else if (isSelected) {
    className = 'seat-selected';
    title = `Seat ${seatNumber} – Selected`;
  } else if (section === 'AC') {
    className = 'seat-available-ac';
    title = `Seat ${seatNumber} – A/C (₹${seatData?.price_per_hour || 50}/hr)`;
  } else {
    className = 'seat-available-nonac';
    title = `Seat ${seatNumber} – Non-A/C (₹${seatData?.price_per_hour || 30}/hr)`;
  }

  return (
    <button
      className={className}
      title={title}
      disabled={isBooked}
      onClick={() => !isBooked && onSelect(seatNumber)}
    >
      {seatNumber}
    </button>
  );
}
