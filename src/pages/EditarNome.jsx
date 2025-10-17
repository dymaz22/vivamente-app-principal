import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useProfile } from '../hooks/useProfile';

const EditarNome = () => {
    const navigate = useNavigate();
    const { profile, updateUsername } = useProfile();
    
    const [username, setUsername] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || '');
        }
    }, [profile]);

    const handleSave = async () => {
        setIsSaving(true);
        const { success } = await updateUsername(username);
        if (success) {
            navigate('/definicoes');
        } else {
            alert("Erro ao salvar.");
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-md mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button type="button" variant="ghost" size="icon" onClick={() => navigate('/definicoes')}><ArrowLeft /></Button>
                    <h1 className="text-2xl font-bold text-white">Nome de utilizador</h1>
                </div>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Digite seu nome"
                        className="w-full px-4 py-3 bg-input rounded-xl text-white"
                    />
                    <Button onClick={handleSave} disabled={isSaving || !username.trim()} className="w-full bg-primary">
                        {isSaving ? <Loader2 className="animate-spin" /> : 'Guardar'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditarNome;