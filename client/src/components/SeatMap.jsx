import Seat from './Seat';
import { FLOOR_LAYOUT, FLOOR_CLUSTERS } from '../utils/seatLayout';

function SeatBlock({ block, seatMap, selectedSeat, onSelect }) {
  return (
    <div className="flex flex-col gap-1">
      {block.rows.map((row, ri) => (
        <div key={ri} className="flex gap-1">
          {row.map((num) => (
            <Seat
              key={num}
              seatNumber={num}
              seatData={seatMap[num]}
              isSelected={selectedSeat === num}
              onSelect={onSelect}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function DividerLabel({ label }) {
  if (!label) return null;
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

export default function SeatMap({ seatMap, selectedSeat, onSelect, loading }) {
  const blockMap = FLOOR_LAYOUT.reduce((acc, b) => {
    acc[b.id] = b;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-max mx-auto p-4">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-100 border-2 border-blue-400" />
            <span className="text-sm text-gray-600">A/C Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-100 border-2 border-emerald-400" />
            <span className="text-sm text-gray-600">Non-A/C Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-100 border-2 border-red-400" />
            <span className="text-sm text-gray-600">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-purple-500 border-2 border-purple-600" />
            <span className="text-sm text-gray-600">Your Selection</span>
          </div>
        </div>

        {/* Entrance indicator */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-800 text-white text-xs font-semibold px-6 py-1.5 rounded-full tracking-wider">
            ENTRANCE / FRONT
          </div>
        </div>

        {/* Floor layout */}
        <div className="flex flex-col gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-inner">
          {FLOOR_CLUSTERS.map((cluster, ci) => (
            <div key={ci}>
              {cluster.divider !== undefined && (
                <DividerLabel label={cluster.divider} />
              )}

              {cluster.type === 'full' ? (
                <div className="flex justify-center">
                  <SeatBlock
                    block={blockMap[cluster.blocks[0]]}
                    seatMap={seatMap}
                    selectedSeat={selectedSeat}
                    onSelect={onSelect}
                  />
                </div>
              ) : (
                <div className="flex justify-between gap-8">
                  <SeatBlock
                    block={blockMap[cluster.left]}
                    seatMap={seatMap}
                    selectedSeat={selectedSeat}
                    onSelect={onSelect}
                  />
                  <div className="w-16 flex items-center justify-center">
                    <div className="h-full w-px bg-gray-200" />
                  </div>
                  <SeatBlock
                    block={blockMap[cluster.right]}
                    seatMap={seatMap}
                    selectedSeat={selectedSeat}
                    onSelect={onSelect}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back wall */}
        <div className="flex justify-center mt-4">
          <div className="bg-gray-300 text-gray-600 text-xs font-semibold px-6 py-1.5 rounded-full tracking-wider">
            BACK WALL
          </div>
        </div>
      </div>
    </div>
  );
}
