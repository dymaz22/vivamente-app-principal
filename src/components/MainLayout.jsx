import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative">
      {/* Conteúdo principal */}
      <main className="pb-20"> {/* Padding bottom para não sobrepor a navegação */}
        <Outlet />
      </main>
      
      {/* Navegação inferior */}
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;

