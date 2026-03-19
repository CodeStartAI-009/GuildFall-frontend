import { useParams, useNavigate } from "react-router-dom";
import "./InfoPage.css";

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
          text: `
1. Join or create a room.
2. Each player takes turns rolling the dice.
3. Move across tiles based on dice value.
4. When landing on a tile:
   - Buy it if unowned.
   - Pay rent if owned by another player.
5. Use special cards and abilities to gain advantage.
6. The goal is to earn the most coins and dominate the board.
          `
        },
        {
          heading: "💰 How to Earn Coins?",
          text: "Win matches, collect rent from other players, and use smart strategies."
        },
        {
          heading: "🤖 Can I Play Solo?",
          text: "Yes. If no players are available, bots will automatically join the game."
        },
        {
          heading: "🎴 What Are Cards?",
          text: "Cards are special abilities that can help you attack, defend, or gain extra rewards."
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
          text: "Cheating, exploiting bugs, or using unfair advantages is strictly prohibited."
        },
        {
          heading: "User Behavior",
          text: "Respect all players. Toxic or abusive behavior may lead to bans."
        },
        {
          heading: "Account Actions",
          text: "We reserve the right to suspend or terminate accounts violating rules."
        }
      ]
    },

    privacy: {
      title: "🔒 Privacy Policy",
      sections: [
        {
          heading: "Data Collection",
          text: "We collect minimal data required for authentication and gameplay."
        },
        {
          heading: "Data Usage",
          text: "Your data is used only to improve gameplay experience."
        },
        {
          heading: "No Data Selling",
          text: "We do not sell or share your personal data with third parties."
        }
      ]
    }
  };

  const page = content[type];

  if (!page) return <div className="info-page">Page not found</div>;

  return (
    <div className="info-page">
      <div className="info-card">

        <button className="info-back" onClick={() => navigate("/")}>
          ← Back
        </button>

        <h1 className="info-title">{page.title}</h1>

        <div className="info-content">
          {page.sections.map((section, i) => (
            <div key={i} className="info-section">
              <h3 className="info-heading">{section.heading}</h3>
              <p className="info-text">{section.text}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}