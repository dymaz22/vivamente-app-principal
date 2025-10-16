import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const Definicoes = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen p-6 pb-24">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate('/perfil')}
                        className="text-white hover:text-white/80"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-2xl font-bold text-white">Definições</h1>
                </div>

                {/* Futuro conteúdo aqui */}
                <p className="text-white/70 text-center">Em breve: opções para alterar nome, senha e mais.</p>
            </div>
        </div>
    );
};

export default Definicoes;