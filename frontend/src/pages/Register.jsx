import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { Button, Input } from '../components'
import { User, Upload } from 'lucide-react'

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    avatar: null,
    coverImage: null,
  })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState(null) // Fixed typo here
  const [errors, setErrors] = useState({})

  const { register, loading, error } = useAuth()
  const { addNotification } = useUI()
  const navigate = useNavigate()

  const fileInputRef = useRef(null)
  const coverImageRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }))
      setAvatarPreview(URL.createObjectURL(file))
      if (errors.avatar) setErrors(prev => ({ ...prev, avatar: '' }))
    }
  }

  const handleCoverImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }))
      setCoverImagePreview(URL.createObjectURL(file)) // Fixed typo
      if (errors.coverImage) setErrors(prev => ({ ...prev, coverImage: '' })) // Fixed avatar validation leak
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.fullName) newErrors.fullName = 'Full name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.username) newErrors.username = 'Username is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const formPayload = new FormData()
    formPayload.append('fullName', formData.fullName)
    formPayload.append('email', formData.email)
    formPayload.append('username', formData.username)
    formPayload.append('password', formData.password)
    if (formData.avatar) formPayload.append('avatar', formData.avatar)
    if (formData.coverImage) formPayload.append('coverImage', formData.coverImage)

    const result = await register(formPayload)
    if (result.success) {
      addNotification('Registration successful! Redirecting...', 'success')
      navigate('/')
    } else {
      addNotification(result.error || 'Registration failed', 'error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-surface px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-text tracking-tight">Create Account</h1>
            <p className="text-sm text-text-secondary mt-2">Join YouTube today</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* coverImage Selection Panel */}
            <div className="relative">
              <div
                onClick={() => coverImageRef.current?.click()}
                className="h-20 bg-tertiary border-2 border-dashed border-border-subtle hover:border-accent/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden rounded-xl"
              >
                {coverImagePreview ? (
                  <img src={coverImagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className='flex items-center gap-1'>
                    <User className="w-6 h-6 text-text-tertiary" />
                    <span className='text-sm text-gray-500 italic'>Upload Cover Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Upload className="w-5 h-5 text-white" />
                </div>
              </div>
              <input ref={coverImageRef} type="file" accept="image/*" className="hidden" onChange={handleCoverImageSelect} />
            </div>

            {/* Avatar Selection Circle */}
            <div className="flex justify-center">
              <div className="relative">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-full bg-tertiary border-2 border-dashed border-border-subtle hover:border-accent/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className='flex flex-col items-center'>
                      <User className="w-6 h-6 text-text-tertiary" />
                      <span className='text-[10px] text-gray-500 italic'>Avatar</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
              </div>
            </div>

            <Input label="Full Name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" error={errors.fullName} />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" error={errors.email} />
            <Input label="Username" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="username" error={errors.username} />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" error={errors.password} />
            <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" error={errors.confirmPassword} />

            <Button fullWidth loading={loading} type="submit" className="mt-2">Create Account</Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-text-secondary">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}