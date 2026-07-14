import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'

export const useLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})
    const { login, loading, error } = useAuth()
    const { addNotification } = useUI()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {}
        if (!formData.email) newErrors.email = 'Email is required'
        if (!formData.password) newErrors.password = 'Password is required'
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

        const result = await login(formData.email, formData.password)
        if (result.success) {
            addNotification('Login successful!', 'success')
            navigate('/')
        } else {
            addNotification(result.error, 'error')
        }
    }

    return {
        formData,
        errors,
        loading,
        error,
        handleChange,
        handleSubmit
    }
}
