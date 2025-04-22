// src/app/game/page.tsx
"use client";
import React, { useEffect } from 'react';
import * as Phaser from 'phaser';
import Room from '../scene/game'; // Import your Room scene

const GamePage: React.FC = () => {
  useEffect(() => {
    const GameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1296,
      height: 926,
      parent: "game-container", // Phaser will render the game here
      backgroundColor: "#028af8",
      scene: [Room], // Use the Room scene
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    // Initialize Phaser game
    const game = new Phaser.Game(GameConfig);

    // Clean up the game when the component unmounts
    return () => {
      game.destroy(true);
    };
  }, []); // Empty array ensures this runs only once (on mount/unmount)

  return (
    <div id="game-container" style={{ width: '100%', height: '100%' }} />
  );
};

export default GamePage;
