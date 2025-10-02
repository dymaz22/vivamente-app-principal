import React from 'react';
import { CheckCircle, Play, Lock } from 'lucide-react';

const ListItemLicao = ({ 
  title, 
  position, 
  duration, 
  status = 'locked', // 'completed', 'unlocked', 'locked'
  onClick,
  className = "" 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-primary" />;
      case 'unlocked':
        return <Play className="w-6 h-6 text-primary" />;
      case 'locked':
      default:
        return <Lock className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-foreground';
      case 'unlocked':
        return 'text-foreground';
      case 'locked':
      default:
        return 'text-muted-foreground';
    }
  };

  const isClickable = status !== 'locked';

  return (
    <div 
      className={`
        flex items-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50
        ${isClickable ? 'cursor-pointer hover:bg-card/50 transition-all duration-200' : 'cursor-not-allowed'}
        ${className}
      `}
      onClick={isClickable ? onClick : undefined}
    >
      {/* Ícone de status */}
      <div className="flex-shrink-0 mr-4">
        {getStatusIcon()}
      </div>
      
      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-primary">
            Lição {position}
          </span>
          {duration && (
            <span className="text-xs text-muted-foreground">
              • {duration}
            </span>
          )}
        </div>
        <h4 className={`font-medium ${getStatusColor()} line-clamp-2`}>
          {title}
        </h4>
      </div>
      
      {/* Indicador visual adicional para lições bloqueadas */}
      {status === 'locked' && (
        <div className="flex-shrink-0 ml-2">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        </div>
      )}
    </div>
  );
};

export default ListItemLicao;

