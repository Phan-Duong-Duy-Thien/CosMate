import { useState } from 'react';
// Import file resources vừa tạo ở Bước 1
// Lưu ý chỉnh lại đường dẫn '../constants/resources' cho đúng với nơi bạn lưu file
import { RESOURCES, type Language } from '@/app/components/ui/resources'; 

import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Sparkles, Mail, Lock, User, ShoppingBag, Store, Check, Globe } from 'lucide-react';

interface AuthPageProps {
  onLogin?: () => void;
}

type UserRole = 'renter' | 'lender' | null;

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  
  // State ngôn ngữ: Mặc định là Tiếng Việt ('VI')
  const [currentLang, setCurrentLang] = useState<Language>('VI');

  // Lấy bộ từ điển tương ứng
  const text = RESOURCES[currentLang];

  // Hàm chuyển đổi ngôn ngữ xoay vòng: VI -> EN -> JA -> VI
  const toggleLanguage = () => {
    if (currentLang === 'VI') setCurrentLang('EN');
    else if (currentLang === 'EN') setCurrentLang('JA');
    else setCurrentLang('VI');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex font-sans"> 
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#e6d9ff] via-[#ffd9e8] to-[#c8f4e8]">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative w-full h-full">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1760965254591-2819bdbda133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NwbGF5JTIwY29udmVudGlvbiUyMGNyb3dkfGVufDF8fHx8MTc2ODg5NTg1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Cosplay convention"
              className="w-full h-full object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#d4c5f9]" />
                <div>
                  <div className="font-semibold text-gray-900">CosMate</div>
                  <div className="text-sm text-gray-600">Find Your Character</div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#d4c5f9]">5K+</div>
                  <div className="text-xs text-gray-600">Costumes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#ffb6d9]">2K+</div>
                  <div className="text-xs text-gray-600">Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#9dd9c7]">500+</div>
                  <div className="text-xs text-gray-600">Rentals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto relative">
        
        {/* Nút Đổi Ngôn Ngữ */}
        <div className="absolute top-6 right-6 z-10">
          <Button
            variant="ghost" 
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-gray-600 hover:text-[#d4c5f9] hover:bg-[#d4c5f9]/10 rounded-full px-3 transition-all border border-gray-100"
          >
            <Globe className="w-4 h-4" />
            {/* Hiển thị tên ngôn ngữ hiện tại */}
            <span className="font-medium min-w-[70px] text-right">{text.langName}</span>
          </Button>
        </div>

        <div className="w-full max-w-md space-y-8 py-8">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 text-2xl font-bold">
              <Sparkles className="w-8 h-8 text-[#d4c5f9]" />
              <span className="bg-gradient-to-r from-[#d4c5f9] via-[#ffb6d9] to-[#9dd9c7] bg-clip-text text-transparent">
                CosMate
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl text-gray-900 font-bold">
              {isLogin ? text.welcomeBack : text.joinCommunity}
            </h1>
            <p className="text-gray-600">
              {isLogin ? text.loginDesc : text.signupDesc}
            </p>
          </div>

          {/* Role Selection */}
          {!isLogin && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 text-center">
                {text.chooseRole}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole('renter')}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    selectedRole === 'renter'
                      ? 'border-[#d4c5f9] bg-[#d4c5f9]/5 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {selectedRole === 'renter' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-[#d4c5f9] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      selectedRole === 'renter' ? 'bg-[#d4c5f9]/20' : 'bg-gray-100'
                    }`}>
                      <ShoppingBag className={`w-8 h-8 ${
                        selectedRole === 'renter' ? 'text-[#d4c5f9]' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{text.renter}</div>
                      <div className="text-xs text-gray-500 mt-1">{text.renterDesc}</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('lender')}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    selectedRole === 'lender'
                      ? 'border-[#d4c5f9] bg-[#d4c5f9]/5 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {selectedRole === 'lender' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-[#d4c5f9] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      selectedRole === 'lender' ? 'bg-[#d4c5f9]/20' : 'bg-gray-100'
                    }`}>
                      <Store className={`w-8 h-8 ${
                        selectedRole === 'lender' ? 'text-[#d4c5f9]' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{text.lender}</div>
                      <div className="text-xs text-gray-500 mt-1">{text.lenderDesc}</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Social Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-2 hover:border-[#d4c5f9] hover:bg-[#d4c5f9]/5"
            >
              {/* Google Icon SVG */}
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {text.google}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-2 hover:border-[#ffb6d9] hover:bg-[#ffb6d9]/5"
            >
               {/* Facebook Icon SVG */}
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              {text.facebook}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">{text.orEmail}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {text.fullName}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={text.enterName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {text.emailAddr}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={text.enterEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {text.password}
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-sm text-[#d4c5f9] hover:text-[#c4b5e9] transition-colors"
                  >
                    {text.forgotPass}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder={text.enterPass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#d4c5f9] focus:ring-[#d4c5f9]"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  {text.agree}{' '}
                  <a href="#" className="text-[#d4c5f9] hover:underline">
                    {text.terms}
                  </a>{' '}
                  {text.and}{' '}
                  <a href="#" className="text-[#d4c5f9] hover:underline">
                    {text.privacy}
                  </a>
                </label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-white shadow-lg hover:shadow-xl transition-all text-base"
              style={{ background: 'linear-gradient(135deg, #d4c5f9, #ffb6d9)' }}
            >
              {isLogin ? text.loginBtn : text.createBtn}
            </Button>
          </form>

          {/* Toggle between Login and Sign Up */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isLogin ? (
                <>
                  {text.noAccount}{' '}
                  <span className="text-[#d4c5f9] font-medium hover:underline">{text.signupLink}</span>
                </>
              ) : (
                <>
                  {text.haveAccount}{' '}
                  <span className="text-[#d4c5f9] font-medium hover:underline">{text.loginLink}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}