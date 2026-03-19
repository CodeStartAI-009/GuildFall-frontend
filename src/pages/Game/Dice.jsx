import { useState, useEffect } from "react";
import { getSocket } from "../../socket/socket";
import { useAuth } from "../../context/AuthContext";
import "./Dice.css";

export default function Dice({ roomId, currentTurn }) {

  const socket = getSocket();
  const { user } = useAuth();

  const [die1, setDie1] = useState(1);
  const [die2, setDie2] = useState(1);
  const [rolling, setRolling] = useState(false);

  const isMyTurn = currentTurn === user?._id;

  /* ===============================
     ROLL DICE
  =============================== */

  const rollDice = () => {

    if (!isMyTurn || rolling || !user) return;

    setRolling(true);

    socket.emit("roll_dice", {
      roomId,
      userId: user._id
    });

  };

  /* ===============================
     RECEIVE DICE RESULT
  =============================== */

  useEffect(() => {

    const handleDiceResult = (data) => {

      if (!data) return;

      const { dice1, dice2 } = data;

      setDie1(dice1);
      setDie2(dice2);

      /* stop animation */

      setTimeout(() => {
        setRolling(false);
      }, 800);

    };

    socket.on("dice_result", handleDiceResult);

    return () => {
      socket.off("dice_result", handleDiceResult);
    };

  }, []); // no socket dependency

  /* ===============================
     UI
  =============================== */

  return (

    <div className="dice-container">

      <div className="dice-row">

        {/* Dice 1 */}

        <div className={`cube ${rolling ? "rolling" : ""}`}>

          <div className="face front">{die1}</div>
          <div className="face back">{die1}</div>
          <div className="face right">{die1}</div>
          <div className="face left">{die1}</div>
          <div className="face top">{die1}</div>
          <div className="face bottom">{die1}</div>

        </div>

        {/* Dice 2 */}

        <div className={`cube ${rolling ? "rolling" : ""}`}>

          <div className="face front">{die2}</div>
          <div className="face back">{die2}</div>
          <div className="face right">{die2}</div>
          <div className="face left">{die2}</div>
          <div className="face top">{die2}</div>
          <div className="face bottom">{die2}</div>

        </div>

      </div>

      {/* Roll Button */}

      <button
        className="roll-btn"
        onClick={rollDice}
        disabled={!isMyTurn || rolling}
      >
        {isMyTurn ? "Roll Dice" : "Waiting Turn"}
      </button>

      {/* Total */}

      <div className="dice-result">
        Total: {die1 + die2}
      </div>

    </div>

  );

}