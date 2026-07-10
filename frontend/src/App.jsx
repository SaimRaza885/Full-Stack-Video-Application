import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { VideoProvider } from './context/VideoContext'
import { UIProvider } from './context/UIContext'
import { Navbar, Sidebar, ToastContainer } from './components'
import { UploadProgressBar } from './components/ui/UploadProgressBar'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import {
  Login,
  Register,
  Home,
  VideoPlayer,
  Channel,
  Search,
  Playlists,
  Profile,
  Upload,
  History,
  Subscriptions,
} from './pages'
import EditVideo from './pages/EditVideo'
import { Liked_Vidoes } from './pages/LikedVideos'

const PageLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-[#0f0f0f] overflow-y-auto">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
      <UploadProgressBar />
    </div>
  )
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PageLayout><Home /></PageLayout>} />
      <Route path="/video/:videoId" element={<PageLayout><VideoPlayer /></PageLayout>} />
      <Route path="/video/edit/:videoId" element={<PageLayout><EditVideo /></PageLayout>} />
      <Route path="/channel/:username" element={<PageLayout><Channel /></PageLayout>} />
      <Route path="/search" element={<PageLayout><Search /></PageLayout>} />
      <Route path="/upload" element={<PageLayout><Upload /></PageLayout>} />
      <Route path="/playlists" element={<PageLayout><Playlists /></PageLayout>} />
      <Route path="/liked-vidoes" element={<PageLayout><Liked_Vidoes /></PageLayout>} />
      <Route path="/profile" element={<PageLayout><Profile /></PageLayout>} />
      <Route path="/subscriptions" element={<PageLayout><Subscriptions /></PageLayout>} />
      <Route path="/history" element={<PageLayout><History /></PageLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <VideoProvider>
          <UIProvider>
            <AppContent />


            <ToastContainer />
          </UIProvider>
        </VideoProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
