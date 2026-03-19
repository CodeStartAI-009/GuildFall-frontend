import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Leaderboard.css";

export default function Leaderboard() {

  const { user } = useAuth();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchLeaderboard = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${baseUrl}/leaderboard`);

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setPlayers(data || []);

      } catch (err) {
        console.error(err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

  }, []);

  if (loading) return <div className="leaderboard-container">⏳ Loading...</div>;
  if (error) return <div className="leaderboard-container">❌ {error}</div>;
  if (!players.length) return <div className="leaderboard-container">No players</div>;

  /* ===============================
     SPLIT DATA
  =============================== */

  const top10 = players.slice(0, 10);

  const myIndex = players.findIndex(
    p => String(p._id) === String(user?._id)
  );

  const myPlayer = myIndex !== -1 ? players[myIndex] : null;

  /* ===============================
     UI
  =============================== */

  return (

    <div className="leaderboard-container">

      <h2 className="leaderboard-title">🏆 Leaderboard</h2>

      {/* TABLE */}
      <div className="leaderboard-table">

        <div className="leaderboard-header">
          <span>Rank</span>
          <span>Player</span>
          <span>Level</span>
          <span>XP</span>
        </div>

        {/* 🔥 SCROLLABLE AREA */}
        <div className="scrollable">

          {top10.map((p, index) => {

            const isMe = String(p._id) === String(user?._id);

            return (
              <div
                key={p._id}
                className={`leaderboard-row 
                  ${index < 3 ? "top-player" : ""} 
                  ${isMe ? "me" : ""}`}
              >

                <span className="rank">
                  {index === 0 ? "🥇" :
                   index === 1 ? "🥈" :
                   index === 2 ? "🥉" :
                   index + 1}
                </span>

                <span className="name">
                  {p.username} {isMe && "(You)"}
                </span>

                <span>{p.level}</span>
                <span>{p.xp}</span>

              </div>
            );
          })}

        </div>

      </div>

      {/* 🔥 YOUR RANK */}
      {myPlayer && myIndex >= 10 && (
        <>
          <div className="leaderboard-divider">•••</div>

          <div className="leaderboard-my-rank">

            <div className="leaderboard-row me">

              <span className="rank">{myIndex + 1}</span>

              <span className="name">
                {myPlayer.username} (You)
              </span>

              <span>{myPlayer.level}</span>
              <span>{myPlayer.xp}</span>

            </div>

          </div>
        </>
      )}

    </div>
  );
}