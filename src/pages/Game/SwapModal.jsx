export default function SwapModal({ board, onSelect }) {

    return (
      <div className="modal">
  
        <h2>🔄 Select tiles to swap</h2>
  
        {/* You can improve UI later */}
        <button onClick={() => onSelect(1, 9)}>
          Example Swap
        </button>
  
      </div>
    );
  }