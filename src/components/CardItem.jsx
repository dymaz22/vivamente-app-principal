import React from 'react';
import { Card, CardContent } from './ui/card';

const CardItem = ({ 
  image_url, 
  title, 
  subtitle, 
  tag, 
  progress, 
  onClick,
  className = "" 
}) => {
  return (
    <Card 
      className={`card-hover cursor-pointer bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl overflow-hidden min-w-[280px] ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Imagem */}
        <div className="relative h-40 overflow-hidden">
          <img 
            src={image_url} 
            alt={title}
            className="w-full h-full object-cover"
          />
          {tag && (
            <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              {tag}
            </div>
          )}
        </div>
        
        {/* Conteúdo */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-2">
            {title}
          </h3>
          {subtitle && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {subtitle}
            </p>
          )}
          
          {/* Barra de progresso */}
          {progress !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">Progresso</span>
                <span className="text-xs text-primary font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="progress-bar h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItem;

