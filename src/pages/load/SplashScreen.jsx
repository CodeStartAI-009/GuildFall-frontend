import "./SplashScreen.css";

import logo from "../../assets/logo/logo.png";
import loading from "../../assets/icons/loading.png";
import company from "../../assets/logo/company.jpeg";

export default function SplashScreen() {
  return (
    <div className="splash-container">

      <div className="magic-circle-wrapper">

        {/* Outer Rotating Circle */}
        <div className="outer-circle" />

        {/* SVG Spell Ring */}
        <svg
          className="spell-svg"
          viewBox="0 0 500 500"
        >
          <defs>
            <path
              id="circlePath"
              d="
                M 250,250
                m -200,0
                a 200,200 0 1,1 400,0
                a 200,200 0 1,1 -400,0
              "
            />
          </defs>

          <text className="spell-text">
            <textPath href="#circlePath" startOffset="0%">
            ⟊⟊ 𓂀 ⟁ ϠϠϠ ☍ ☌ ⟁ 
ϞϞ ⟁⟁ 𖤐 𖥔 ⟊⟊⟊ 
☽ ⟁ Ϡ Ϡ Ϡ ⟁ ☉ 
⟊ 𓂀 ⟁ ☍ 𖤐 ϞϞϞ 
⟁⟁⟁ ☌ ☌ ϠϠ 𖥔 
⟊⟊ 𓂀 ⟁ ϠϠϠ ☍ ☌ ⟁
ϞϞ ⟁⟁ 𖤐 𖥔 ⟊⟊⟊
☽ ⟁ Ϡ Ϡ Ϡ ⟁ ☉
⟊ 𓂀 ⟁ ☍ 𖤐 ϞϞϞ
⟁⟁⟁ ☌ ☌ ϠϠ 𖥔
            </textPath>
          </text>
        </svg>

        {/* Inner Circle */}
        <div className="inner-circle" />

        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Guildfall" className="main-logo" />
        </div>

      </div>

      {/* Bottom Left Loading */}
      <div className="loading-section">
        <div className="shield-wrapper">
          <img src={loading} alt="Loading" className="shield-img" />
          <div className="shield-energy" />
        </div>
      </div>

      {/* Bottom Right Company Logo */}
      <img src={company} alt="Company Logo" className="company-logo" />

    </div>
  );
}