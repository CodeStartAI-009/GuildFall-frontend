import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AuctionModal.css";

export default function AuctionModal({ auction, onBid }) {

  const { user } = useAuth();

  const [currentBid, setCurrentBid] = useState(0);

  if (!auction) return null;

  const baseCost = auction.baseCost || 0;
  const highestBid = auction.highestBid || 0;

  /* ===============================
     START BID VALUE
  =============================== */

  useEffect(() => {
    if (highestBid === 0) {
      setCurrentBid(baseCost);
    } else {
      setCurrentBid(highestBid + 10);
    }
  }, [auction]);

  /* ===============================
     CREATOR CHECK
  =============================== */

  const isCreator =
    String(auction.creator) === String(user?._id);

  /* ===============================
     BID HANDLER
  =============================== */

  const placeBid = () => {

    if (currentBid <= highestBid) return;

    onBid(currentBid);
  };

  /* ===============================
     INCREMENT BUTTONS
  =============================== */

  const addBid = (amount) => {
    setCurrentBid(prev => prev + amount);
  };

  /* ===============================
     UI
  =============================== */

  return (

    <div className="auction-modal">

      <h2>🏷️ Auction</h2>

      <p>Tile: {auction.position}</p>

      <p className="base-cost">
        Base Cost: {baseCost}
      </p>

      <p className="highest-bid">
        Highest Bid: {highestBid}
      </p>

      {/* CURRENT BID DISPLAY */}

      <div className="current-bid">
        Your Bid: {currentBid}
      </div>

      {/* INCREMENT BUTTONS */}

      <div className="bid-buttons">

        <button onClick={() => addBid(10)} disabled={isCreator}>
          +10
        </button>

        <button onClick={() => addBid(20)} disabled={isCreator}>
          +20
        </button>

        <button onClick={() => addBid(30)} disabled={isCreator}>
          +30
        </button>

      </div>

      {/* PLACE BID */}

      <button
        className="bid-btn"
        onClick={placeBid}
        disabled={isCreator}
      >
        {isCreator ? "You started this auction" : "Place Bid"}
      </button>

    </div>

  );
}