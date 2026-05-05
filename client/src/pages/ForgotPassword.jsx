import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
});

const ForgotPassword = () => {
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const forgotPassword = useAuthStore((s) => s.forgotPassword);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (formData) => {
    try {
      setServerError('');
      await forgotPassword(formData.email);
      setIsSuccess(true);
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
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
          {isSuccess ? (
            <div className="text-center py-6">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Check your email</h2>
              <p className="text-slate-500 text-sm mb-6">
                If an account with that email exists, we&apos;ve sent a password reset link.
                The link will expire in 10 minutes.
              </p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={28} className="text-sky-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">Forgot your password?</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
                  {serverError}
                </div>
              )}

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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Mail size={20} />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                <Link to="/login" className="text-sky-600 hover:text-sky-700 font-medium inline-flex items-center gap-1">
                  <ArrowLeft size={14} />
                  Back to Login
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
