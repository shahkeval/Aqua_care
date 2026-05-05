import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Must include uppercase, lowercase, number & special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
  phone: yup.string().trim().max(15, 'Phone number is too long').optional(),
  roModel: yup.string().trim().optional(),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (formData) => {
    try {
      setServerError('');
      // Remove confirmPassword before sending
      const { confirmPassword, ...payload } = formData;
      await registerUser(payload);
      navigate('/client/dashboard', { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
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
            <h2 className="text-xl font-semibold text-slate-800">Create your account</h2>
            <p className="text-slate-500 text-sm mt-1">Start your 14-day free trial</p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className="input-field"
                placeholder="John Doe"
                {...register('name')}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

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
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="input-field"
                  placeholder="+91 98765 43210"
                  {...register('phone')}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="roModel" className="block text-sm font-medium text-slate-700 mb-1">
                  RO Model (optional)
                </label>
                <input
                  id="roModel"
                  type="text"
                  className="input-field"
                  placeholder="Kent Pearl"
                  {...register('roModel')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="input-field"
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <UserPlus size={20} />
              )}
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 hover:text-sky-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
