import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Bot, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'aprender',
      label: 'Aprender',
      icon: BookOpen,
      path: '/aprender'
    },
    {
      id: 'rotina',
      label: 'Rotina',
      icon: Calendar,
      path: '/rotina'
    },
    {
      id: 'companheiro',
      label: 'Companheiro',
      icon: Bot,
      path: '/companheiro'
    },
    {
      id: 'perfil',
      label: 'Perfil',
      icon: User,
      path: '/perfil'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/aprender' && location.pathname.startsWith('/aprender')) ||
           (path === '/aprender' && location.pathname.startsWith('/programa')) ||
           (path === '/aprender' && location.pathname.startsWith('/licao')) ||
           (path === '/aprender' && location.pathname.startsWith('/ferramentas')) ||
           (path === '/aprender' && location.pathname.startsWith('/adicionar-tarefa'));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
                active 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-white/60 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${active ? 'text-primary' : ''}`} />
              <span className={`text-xs font-medium ${active ? 'text-primary' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;

