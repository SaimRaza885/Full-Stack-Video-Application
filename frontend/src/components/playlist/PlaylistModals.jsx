import React from 'react'
import { Modal, Input, Button } from '../../components'

export const CreatePlaylistModal = ({
    showModal,
    setShowModal,
    newPlaylistName,
    setNewPlaylistName,
    newPlaylistDescription,
    setNewPlaylistDescription,
    handleCreatePlaylist
}) => {
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Playlist">
            <div className="space-y-4">
                <Input
                    label="Playlist Name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="My awesome playlist"
                />
                <Input
                    label="Description"
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    placeholder="A short description of this playlist"
                />
                <div className="flex gap-3">
                    <Button fullWidth variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button fullWidth onClick={handleCreatePlaylist}>Create</Button>
                </div>
            </div>
        </Modal>
    )
}

export const EditPlaylistModal = ({
    showEditModal,
    setShowEditModal,
    setEditingPlaylist,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    handleEditPlaylist
}) => {
    return (
        <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditingPlaylist(null) }} title="Edit Playlist">
            <div className="space-y-4">
                <Input
                    label="Playlist Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="My awesome playlist"
                />
                <Input
                    label="Description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="A short description of this playlist"
                />
                <div className="flex gap-3">
                    <Button fullWidth variant="secondary" onClick={() => { setShowEditModal(false); setEditingPlaylist(null) }}>Cancel</Button>
                    <Button fullWidth onClick={handleEditPlaylist}>Save</Button>
                </div>
            </div>
        </Modal>
    )
}
