"use client";

import dynamic from 'next/dynamic';

// Dynamically load the PhaserGame component with SSR disabled
const PhaserGame = dynamic(() => import('../components/game/PhaserGame'), {
  ssr: false,
});

const GamePage = () => {
  return <PhaserGame />;
};

export default GamePage;
