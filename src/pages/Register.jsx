import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import PetalsAnimation from '../components/PetalsAnimation';
import { useAuth } from '../hooks/useAuth.jsx'; // CORRIGIDO

const Register = () => {
  const navigate = useNavigate();
  const { signUp, authLoading } = useAuth(); // CORRIGIDO
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // O 'isLoading' foi removido pois agora usamos 'authLoading' do useAuth

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // FUNÇÃO handleSubmit COMPLETAMENTE SUBSTITUÍDA
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    // Usando nossa nova função signUp do useAuth
    const { success } = await signUp(formData.email, formData.password);

    // Se o cadastro funcionou, o hook useAuth vai atualizar o estado
    // e o nosso app vai redirecionar automaticamente.
    // O 'navigate' aqui é uma segurança extra.
    if (success) {
      console.log('Navegando para /aprender após sucesso no registro.');
      navigate('/aprender');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative flex items-center justify-center p-4">
      <PetalsAnimation />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Vivamente</h1>
          <p className="text-white/70">Crie sua conta</p>
        </div>

        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Nome Completo */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-white">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  className="pl-10 bg-input border-border text-white placeholder:text-white/50"
                  required
                />
              </div>
            </div>

            {/* Campo Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  className="pl-10 bg-input border-border text-white placeholder:text-white/50"
                  required
                />
              </div>
            </div>

            {/* Campos de Senha (sem alterações) ... */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-input border-border text-white placeholder:text-white/50"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-input border-border text-white placeholder:text-white/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 custom-checkbox"
                required
              />
              <label htmlFor="terms" className="text-sm text-white/70">
                Concordo com os{' '}
                <Link to="/terms" className="text-primary hover:text-primary/80">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link to="/privacy" className="text-primary hover:text-primary/80">
                  Política de Privacidade
                </Link>
              </label>
            </div>
            
            {/* BOTÃO CORRIGIDO */}
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={authLoading}
            >
              {authLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-border/50"></div>
            <span className="px-4 text-sm text-white/50">ou</span>
            <div className="flex-1 border-t border-border/50"></div>
          </div>

          <div className="text-center">
            <p className="text-white/70">
              Já tem uma conta?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <p className="text-sm text-primary font-medium mb-2">💡 Demo</p>
            <p className="text-xs text-white/70">
              Preencha os campos para criar uma conta de demonstração
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;