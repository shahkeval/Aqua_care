import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (formData) => {
    try {
      setServerError('');
      const data = await login(formData);
      const role = data.data.user.role;
      // Redirect based on role
      if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (role === 'employee') navigate('/employee/dashboard', { replace: true });
      else navigate('/client/dashboard', { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-sky-600 mb-2">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              AquaCare
            </Link>
            <h2 className="text-xl font-semibold text-slate-800">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input-field"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input-field pr-10"
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <LogIn size={20} />
              )}
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-sky-600 hover:text-sky-700 font-medium">
              Start free trial
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
