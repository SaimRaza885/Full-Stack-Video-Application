import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { LoginForm } from '../components/auth/LoginForm'

export const Login = () => {
  const {
    formData,
    errors,
    loading,
    error,
    handleChange,
    handleSubmit
  } = useLogin()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-surface px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-text tracking-tight">Sign In</h1>
            <p className="text-sm text-text-secondary mt-2">to your YouTube account</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>
          )}

          <LoginForm 
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />

          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-text-secondary">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:text-accent-hover font-medium transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

