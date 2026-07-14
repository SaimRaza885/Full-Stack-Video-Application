import { useProfile } from '../hooks/useProfile'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { ProfileStats } from '../components/profile/ProfileStats'
import { ProfileSettingsForm } from '../components/profile/ProfileSettingsForm'

export const Profile = () => {
  const {
    user,
    authLoading,
    activeTab,
    setActiveTab,
    setIsEditing,
    loading,
    stats,
    statsLoading,
    timeframe,
    setTimeframe,
    formData,
    avatarPreview,
    coverPreview,
    handleChange,
    handleSubmit,
    handleAvatarUpdate,
    handleCoverImageUpdate
  } = useProfile()

  if (!user) {
    return <div className="container-custom py-12 text-text-secondary text-center">Please log in to view your profile</div>
  }

  if (authLoading) {
    return <div className="container-custom py-12 text-text-secondary text-center">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-background text-text-primary">
      <ProfileHeader 
        user={user}
        coverPreview={coverPreview}
        avatarPreview={avatarPreview}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsEditing={setIsEditing}
        handleCoverImageUpdate={handleCoverImageUpdate}
        handleAvatarUpdate={handleAvatarUpdate}
      />

      {activeTab === 'analytics' ? (
        <ProfileStats 
          stats={stats}
          statsLoading={statsLoading}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
      ) : (
        <ProfileSettingsForm 
          formData={formData}
          loading={loading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setIsEditing={setIsEditing}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  )
}