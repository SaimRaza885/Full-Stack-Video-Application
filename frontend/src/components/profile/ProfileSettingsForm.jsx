import React from 'react'
import { Card, Input, Button } from '../../components'

export const ProfileSettingsForm = ({
    formData,
    loading,
    handleChange,
    handleSubmit,
    setIsEditing,
    setActiveTab
}) => {
    return (
        <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-secondary/40 border border-white/5 shadow-2xl rounded-2xl backdrop-blur-md animate-fadeIn">
            <div className="mb-6 border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold tracking-tight">Profile Information Settings</h3>
                <p className="text-xs text-text-tertiary">Manage configurations for public display metadata visibility properties.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Input 
                        label="Full Creator Display Name" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        placeholder="Enter your full name" 
                        className="w-full bg-background/50 border-white/10 focus:border-accent text-sm rounded-xl px-4 py-3" 
                    />
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <Button type="submit" loading={loading} className="px-6 py-2.5 rounded-xl shadow-lg shadow-accent/20 text-xs font-bold">
                        Save Profile Changes
                    </Button>
                    <Button variant="secondary" type="button" onClick={() => { setIsEditing(false); setActiveTab('analytics'); }} disabled={loading} className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold">
                        Discard
                    </Button>
                </div>
            </form>
        </Card>
    )
}
