import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'

export const useRegister = () => {
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
    const [coverImagePreview, setCoverImagePreview] = useState(null)
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
            setCoverImagePreview(URL.createObjectURL(file))
            if (errors.coverImage) setErrors(prev => ({ ...prev, coverImage: '' }))
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

    return {
        formData,
        errors,
        avatarPreview,
        coverImagePreview,
        loading,
        error,
        fileInputRef,
        coverImageRef,
        handleChange,
        handleAvatarSelect,
        handleCoverImageSelect,
        handleSubmit
    }
}
