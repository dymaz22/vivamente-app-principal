import React, { useState, useRef } from 'react';

const CustomCheckbox = ({ checked, onChange, className = "" }) => {
  const [confetti, setConfetti] = useState([]);
  const checkboxRef = useRef(null);

  const createConfetti = () => {
    const colors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];
    const newConfetti = [];
    
    for (let i = 0; i < 12; i++) {
      newConfetti.push({
        id: Math.random(),
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.3,
        angle: (Math.random() - 0.5) * 60, // Ângulo entre -30 e 30 graus
      });
    }
    
    setConfetti(newConfetti);
    
    // Limpar confetes após a animação
    setTimeout(() => {
      setConfetti([]);
    }, 1000);
  };

  const handleChange = (e) => {
    const isChecked = e.target.checked;
    onChange(isChecked);
    
    // Criar animação de confetes apenas quando marcar como concluído
    if (isChecked) {
      createConfetti();
    }
  };

  return (
    <div className={`relative ${className}`} ref={checkboxRef}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="custom-checkbox"
      />
      
      {/* Confetes */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.angle}deg)`,
            left: '50%',
            top: '50%',
          }}
        />
      ))}
    </div>
  );
};

export default CustomCheckbox;

