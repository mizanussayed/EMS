import { GraduationCap, Lock, Mail } from 'lucide-react';

interface LoginFormProps {
  userName: string;
  password: string;
  loading?: boolean;
  errorMessage?: string | null;
  onUserNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export default function LoginForm({
  userName,
  password,
  loading = false,
  errorMessage,
  onUserNameChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D6CDF] to-[#1a4ba8] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#2D6CDF] rounded-full flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-gray-900 mb-2">Education Management System</h1>
            <p className="text-gray-500">Sign in to continue</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={userName}
                onChange={(event) => onUserNameChange(event.target.value)}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF] focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF] focus:border-transparent"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <button
            onClick={onSubmit}
            disabled={loading || !userName.trim() || !password}
            className="w-full bg-[#2D6CDF] text-white py-3 rounded-lg shadow-lg hover:bg-[#1a4ba8] transition-all mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
        <div className="text-center mt-6 text-white text-sm">
          <p>© 2025 Education Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}