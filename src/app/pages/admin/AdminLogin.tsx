import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { LogIn, Lock, User } from "lucide-react";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // redirect authenticated users away from login
  useEffect(() => {
    if (isAdminAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await login(username, password);
    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Modern Magazine</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          {/* Demo credentials removed — use real admin credentials */}
        </div>
      </div>
    </div>
  );
}
