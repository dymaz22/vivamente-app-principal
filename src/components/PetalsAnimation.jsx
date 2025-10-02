import React, { useEffect, useState } from 'react';

const PetalsAnimation = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const createPetal = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const delay = Math.random() * 2; // Delay aleatório entre 0-2s
      const leftPosition = Math.random() * 100; // Posição horizontal aleatória
      const animationDuration = 8 + Math.random() * 4; // Duração entre 8-12s
      
      return {
        id,
        delay,
        leftPosition,
        animationDuration,
      };
    };

    // Criar pétalas iniciais
    const initialPetals = Array.from({ length: 8 }, createPetal);
    setPetals(initialPetals);

    // Adicionar novas pétalas periodicamente
    const interval = setInterval(() => {
      setPetals(currentPetals => {
        // Remover pétalas antigas (mais de 15s)
        const filteredPetals = currentPetals.filter(petal => 
          Date.now() - petal.createdAt < 15000
        );
        
        // Adicionar nova pétala
        const newPetal = {
          ...createPetal(),
          createdAt: Date.now()
        };
        
        return [...filteredPetals, newPetal];
      });
    }, 2000); // Nova pétala a cada 2 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="petals-container">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal"
          style={{
            left: `${petal.leftPosition}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default PetalsAnimation;

