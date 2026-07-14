import React from 'react'
import { Input, Button } from '../../components'

export const LoginForm = ({ formData, errors, handleChange, handleSubmit, loading }) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
                label="Email" 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="your@email.com" 
                error={errors.email} 
            />
            <Input 
                label="Password" 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
                error={errors.password} 
            />
            <Button fullWidth loading={loading} type="submit">Sign In</Button>
        </form>
    )
}
