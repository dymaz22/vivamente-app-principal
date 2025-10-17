import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';

const AlterarSenha = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    setError('');
    if (newPassword.length < 6) { setError('A senha deve ter no mínimo 6 caracteres.'); return; }
    if (newPassword !== confirmPassword) { setError('As senhas não coincidem.'); return; }
    
    setIsSaving(true);
    const { success, error: apiError } = await updatePassword(newPassword);
    
    if (success) {
      setSuccessMessage('Senha alterada com sucesso!');
      setTimeout(() => navigate('/definicoes'), 2000);
    } else {
      setError(apiError?.message || 'Ocorreu um erro ao alterar a senha.');
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23]">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button type="button" variant="ghost" size="icon" onClick={() => navigate('/definicoes')} className="text-white"><ArrowLeft /></Button>
          <h1 className="text-2xl font-bold text-white">Alterar palavra-passe</h1>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova palavra-passe" className="w-full px-4 py-3 bg-input border-border rounded-xl text-white" disabled={isSaving} />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-white/70">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
          </div>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar nova palavra-passe" className="w-full px-4 py-3 bg-input border-border rounded-xl text-white" disabled={isSaving} />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          {successMessage && (<div className="flex items-center justify-center gap-2 text-green-400"><CheckCircle size={18} /><p className="text-sm font-medium">{successMessage}</p></div>)}
          <Button onClick={handleSave} disabled={isSaving || !newPassword || !confirmPassword} className="w-full bg-primary">
            {isSaving ? <Loader2 className="animate-spin" /> : 'Alterar Senha'}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default AlterarSenha;