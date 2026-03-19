import { useParams, useNavigate } from "react-router-dom";
import "./Infopage.css";

export default function InfoPage() {
  const { type } = useParams();
  const navigate = useNavigate();

  const content = {
    features: {
      title: "✨ Features",
      sections: [
        {
          heading: "🎮 Multiplayer Gameplay",
          text: "Play with friends or online players in real-time strategic matches."
        },
        {
          heading: "🧠 Smart Bots",
          text: "No players? No problem. AI bots will fill the lobby so you can play anytime."
        },
        {
          heading: "💰 Rewards System",
          text: "Earn coins and XP by winning matches and completing actions in-game."
        },
        {
          heading: "🏆 Leaderboard",
          text: "Compete globally and climb the ranks based on your performance."
        },
        {
          heading: "🎴 Cards & Abilities",
          text: "Buy tiles and use special abilities to gain advantage over opponents."
        }
      ]
    },

    faq: {
      title: "❓ FAQ",
      sections: [
        {
          heading: "🎯 How to Play",
          text: `1. Join or create a room.
2. Each player takes turns rolling the dice.
3. Move across tiles based on dice value.
4. When landing on a tile:
   - Buy it if unowned.
   - Pay rent if owned by another player.
5. Use special cards and abilities.
6. Earn the most coins to win.`
        },
        {
          heading: "💰 How to Earn Coins?",
          text: "Win matches, collect rent, and use smart strategies."
        },
        {
          heading: "🤖 Can I Play Solo?",
          text: "Yes. Bots will automatically join if no players are available."
        },
        {
          heading: "🎴 What Are Cards?",
          text: "Cards are abilities that help you attack, defend, or gain rewards."
        },
        {
          heading: "📱 Is Internet Required?",
          text: "Yes, since the game is real-time multiplayer."
        }
      ]
    },

    terms: {
      title: "📜 Terms & Conditions",
      sections: [
        {
          heading: "Fair Play",
          text: "Cheating or exploiting bugs is strictly prohibited."
        },
        {
          heading: "User Behavior",
          text: "Respect all players. Toxic behavior may lead to bans."
        },
        {
          heading: "Account Actions",
          text: "We may suspend accounts violating rules."
        }
      ]
    },

    privacy: {
      title: "🔒 Privacy Policy",
      sections: [
        {
          heading: "Data Collection",
          text: "We collect minimal data for authentication and gameplay."
        },
        {
          heading: "Data Usage",
          text: "Used only to improve user experience."
        },
        {
          heading: "No Data Selling",
          text: "We do not sell your data."
        }
      ]
    }
  };

  const page = content[type];

  if (!page) {
    return (
      <div className="info-page">
        <div className="info-card">
          <h2>Page not found</h2>
          <button onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="info-page">
      <div className="info-card">

        <button className="info-back" onClick={() => navigate("/")}>
          ← Back
        </button>

        <h1 className="info-title">{page.title}</h1>

        <div className="info-content">
          {page.sections?.map((section, i) => (
            <div key={i} className="info-section">
              <h3 className="info-heading">{section.heading}</h3>
              
              {/* Preserve line breaks */}
              <p className="info-text" style={{ whiteSpace: "pre-line" }}>
                {section.text}
              </p>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}