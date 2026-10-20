import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@shared/schemas';
import { useAuth } from '../../hooks/useAuth';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setAuthError(null);
      await login(data);
      navigate('/admin');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError('Authentication failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] flex flex-col justify-center items-center px-4 py-12">
      {/* Back to site */}
      <Link
        to="/"
        className="mb-8 inline-flex items-center text-xs font-medium text-[#5B6B82] hover:text-[#3898EC] transition"
      >
        <ArrowLeft size={14} className="mr-1.5" /> Back to Portfolio
      </Link>

      <div className="w-full max-w-md bg-white border border-[#DCEAF7] rounded-2xl shadow-xl shadow-[#3898EC]/5 p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#3898EC] to-[#2483D6] text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-[#3898EC]/25 mb-4">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-bold text-[#172B4D] tracking-tight">Admin Authentication</h1>
          <p className="text-sm text-[#5B6B82] mt-1.5">
            Sign in to manage portfolio content, projects, and articles.
          </p>
        </div>

        {/* Error banner */}
        {authError && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start space-x-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                {...register('email')}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30 focus:border-[#3898EC] transition"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#DCEAF7] rounded-xl text-xs text-[#172B4D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3898EC]/30 focus:border-[#3898EC] transition"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-[#3898EC] hover:bg-[#2483D6] text-white text-xs font-semibold rounded-xl shadow-md shadow-[#3898EC]/25 hover:shadow-lg hover:shadow-[#3898EC]/35 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#DCEAF7] text-center text-xs text-[#7A889B]">
          <p>Protected by server-side sessions & scrypt encryption.</p>
        </div>
      </div>
    </div>
  );
};
