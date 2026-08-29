import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api/authApi";
import { useAuthStore } from "../stores/authStore";

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);

      login(
        {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          image: data.image,
        },
        data.accessToken,
        data.refreshToken
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          SprintDesk
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          Sign in to your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-slate-900"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-900"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Sign In */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-4 text-sm text-slate-500">
          Demo: <span className="font-medium text-slate-700">emilys</span>
          {" / "}
          <span className="font-medium text-slate-700">
            emilyspass
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;