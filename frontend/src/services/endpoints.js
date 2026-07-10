import api from './api'

// Video APIs
export const videoAPI = {
  getAllVideos: (params) => api.get('/videos/', { params }),
  getVideoById: (id) => api.get(`/videos/${id}`),
  uploadVideo: (formData, onProgress) => api.post('/videos/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
    timeout: 600000,
  }),
  updateVideo: (id, formData) => api.patch(`/videos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteVideo: (id) => api.delete(`/videos/${id}`),
  getVideosByUser: (userId, params = {}) => api.get('/videos/', { params: { userId, ...params } }),
  incrementViews: (videoId) => api.patch(`/videos/views/${videoId}`),
  togglePublishStatus: (videoId, status) => api.patch(`/videos/toggle/publish/${videoId}`, status),
}

// Comment APIs
export const commentAPI = {
  getComments: (videoId, params) => api.get(`/comments/${videoId}`, { params }),
  addComment: (videoId, data) => api.post(`/comments/${videoId}`, data),
  updateComment: (commentId, data) => api.patch(`/comments/c/${commentId}`, data),
  deleteComment: (commentId) => api.delete(`/comments/c/${commentId}`),
}

// Like APIs
export const likeAPI = {
  likeVideo: (videoId) => api.post(`/likes/toggle/v/${videoId}`),
  getLikedVideos: () => api.get('/likes/videos'),
}

// Playlist APIs
export const playlistAPI = {
  getUserPlaylists: (userId) => api.get(`/playlist/user/${userId}`),
  getPlaylistById: (id) => api.get(`/playlist/${id}`),
  createPlaylist: (data) => api.post('/playlist', data),
  updatePlaylist: (id, data) => api.patch(`/playlist/${id}`, data),
  deletePlaylist: (id) => api.delete(`/playlist/${id}`),
  addVideoToPlaylist: (playlistId, videoId) => api.patch(`/playlist/add/${videoId}/${playlistId}`),
  removeVideoFromPlaylist: (playlistId, videoId) => api.patch(`/playlist/remove/${videoId}/${playlistId}`),
}

// Channel APIs
export const channelAPI = {
  getChannelByUsername: (username) => api.get(`/users/c/${username}`),
  subscribeChannel: (channelId) => api.post(`/subscriptions/c/${channelId}`),
  getSubscribers: (channelId, params) => api.get(`/subscriptions/c/${channelId}`, { params }),
  getSubscriptions: (subscriberId) => api.get(`/subscriptions/u/${subscriberId}`),
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getVideos: () => api.get('/dashboard/videos'),
}

// User API
export const userAPI = {
  getHistory: () => api.get('/users/history'),
  changeAvatar: (data) => api.patch('/users/change-avatar', data,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  changeCoverImage: (data) => api.patch('/users/change-cover-image', data,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),


}

// Search API
export const searchAPI = {
  search: (query, params) => api.get('/videos/', { params: { query, ...params } }),
}
