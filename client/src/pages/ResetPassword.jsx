import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Lock, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

const schema = yup.object({
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
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (formData) => {
    try {
      setServerError('');
      await resetPassword(token, formData.password);
      setIsSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Reset failed. The link may have expired.'
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
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Password reset!</h2>
              <p className="text-slate-500 text-sm mb-6">
                Your password has been reset successfully. Redirecting to login...
              </p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={28} className="text-sky-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">Set new password</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Choose a strong password for your account
                </p>
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
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
                    <Lock size={20} />
                  )}
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
