import React, { useState } from 'react';
import './MyClips.css';
import { FaCamera, FaTrash, FaEdit, FaSave } from 'react-icons/fa';

function MyClps() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clips, setClips] = useState([]);
  const [draggedFile, setDraggedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Handle file upload when the button is clicked
  const handleUpload = () => {
    if (draggedFile) {
      // Check if the file already exists in the clips list
      const isDuplicate = clips.some((clip) => clip.file.name === draggedFile.name);

      if (isDuplicate) {
        alert('This video has already been uploaded!');
        return; // Prevent duplicate upload
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Add the new video to the clips list without preview
        setClips([...clips, { file: draggedFile, preview: reader.result, title, description, approved: false }]);
      };
      reader.readAsDataURL(draggedFile);

      // Reset the dragged file, title, and description after upload
      setDraggedFile(null);
      setDescription('');
      setTitle('');
    }
  };

  // Handle file drop
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setDraggedFile(file); // Store the dropped file
      setDescription(`File ready to upload: ${file.name}`);
    }
  };

  // Handle drag over
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Delete a clip
  const handleDeleteClip = (index) => {
    const updatedClips = clips.filter((clip, i) => i !== index);
    setClips(updatedClips);
  };

  // Edit clip details (title and description)
  const handleEditClip = (index) => {
    const clipToEdit = clips[index];
    setTitle(clipToEdit.title);
    setDescription(clipToEdit.description);
    setEditingIndex(index);
  };

  // Save edited clip
  const handleSaveEdit = () => {
    const updatedClips = clips.map((clip, index) =>
      index === editingIndex ? { ...clip, title, description } : clip
    );
    setClips(updatedClips);
    setEditingIndex(null);
    setTitle('');
    setDescription('');
  };

  // Approve clip (to show it in the list)
  const handleApproveClip = (index) => {
    const updatedClips = [...clips];
    updatedClips[index].approved = true;
    setClips(updatedClips);
  };

  return (
    <div className="my-clips">
      <header>
        <h1>My Clips</h1>
      </header>
      <section className="clip-form">
        <h2>Title</h2>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />
        <div
          className="description-input"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <textarea
            placeholder={
              isDragging
                ? "Drop the file here..."
                : "Type here something or drag and drop photos, audios, and videos here..."
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="upload-section">
          <label className="upload-label" htmlFor="upload-input">
            <FaCamera className="camera-icon" />
            Upload Video
          </label>
          <input type="file" accept="video/*" onChange={(e) => setDraggedFile(e.target.files[0])} className="upload-input" id="upload-input" />
          <button className="add-clips-button" onClick={handleUpload}>
            Add Clips
          </button>
        </div>
      </section>

      <section className="clip-list">
        <h2>Clips</h2>
        <div className="clips-grid">
          {clips.map((clip, index) =>
            clip.approved ? (
              <div key={index} className="clip-card">
                <h3>{clip.title}</h3>
                <p>{clip.description}</p>
                <video src={clip.preview} controls width="320" height="240"></video>
                <div className="clip-actions">
                  <button onClick={() => handleEditClip(index)}>
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDeleteClip(index)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div key={index} className="clip-card">
                <h3>{clip.title} (Pending Approval)</h3>
                <button onClick={() => handleApproveClip(index)}>Approve</button>
              </div>
            )
          )}
        </div>
      </section>

      {editingIndex !== null && (
        <div className="edit-modal">
          <h3>Edit Clip</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Edit title"
            style={{ color: '#ec4899' }}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Edit description"
            style={{ color: '#ec4899' }}
          ></textarea>
          <button onClick={handleSaveEdit}>
            <FaSave /> Save
          </button>
          <button onClick={() => setEditingIndex(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default MyClps;
