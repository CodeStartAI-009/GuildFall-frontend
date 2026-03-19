import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Leaderboard.css";

export default function Leaderboard() {

  const { user } = useAuth();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     FETCH LEADERBOARD
  =============================== */

  useEffect(() => {

    const fetchLeaderboard = async () => {

      try {

        const baseUrl = import.meta.env.VITE_API_URL;

        const res = await fetch(`${baseUrl}leaderboard`);

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        setPlayers(data || []);

      } catch (err) {
        console.error("Leaderboard error:", err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }

    };

    fetchLeaderboard();

  }, []);

  /* ===============================
     LOADING
  =============================== */

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-loading">
          ⏳ Loading leaderboard...
        </div>
      </div>
    );
  }

  /* ===============================
     ERROR
  =============================== */

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-error">
          ❌ {error}
        </div>
      </div>
    );
  }

  /* ===============================
     EMPTY STATE
  =============================== */

  if (!players.length) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-empty">
          No players yet
        </div>
      </div>
    );
  }

  /* ===============================
     UI
  =============================== */

  return (

    <div className="leaderboard-container">

      <h2 className="leaderboard-title">🏆 Global Leaderboard</h2>

      <div className="leaderboard-table">

        <div className="leaderboard-header">
          <span>Rank</span>
          <span>Player</span>
          <span>Level</span>
          <span>XP</span>
        </div>

        {players.map((p, index) => {

          const isMe =
            String(p._id) === String(user?._id);

          return (

            <div
              key={p._id || index}
              className={`leaderboard-row 
                ${index < 3 ? "top-player" : ""} 
                ${isMe ? "me" : ""}`
              }
            >

              <span className="rank">
                {index === 0 ? "🥇" :
                 index === 1 ? "🥈" :
                 index === 2 ? "🥉" :
                 index + 1}
              </span>

              <span className="name">
                {p.username}
                {isMe && " (You)"}
              </span>

              <span>{p.level}</span>
              <span>{p.xp}</span>

            </div>

          );

        })}

      </div>

    </div>

  );
}