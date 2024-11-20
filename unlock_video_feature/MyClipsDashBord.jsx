import React, { useRef, useState } from "react";
import { FaCamera, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import './MyClips.css';

function MyClps() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clips, setClips] = useState([]);
  const [draggedFile, setDraggedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [droppedVideos, setDroppedVideos] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const uploadBoxRef = useRef();

  // Handle file upload when the button is clicked
  const handleUpload = () => {
    if (draggedFile) {
      const isDuplicate = clips.some((clip) => clip.file.name === draggedFile.name);

      if (isDuplicate) {
        alert('This video has already been uploaded!');
        return; // Prevent duplicate upload
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setClips([...clips, { file: draggedFile, preview: reader.result, title, description, approved: false, amount: amounts[0] }]);
      };
      reader.readAsDataURL(draggedFile);

      setDraggedFile(null);
      setDescription('');
      setTitle('');
      setDroppedVideos([]);
      setAmounts([]);
    }
  };

  // Handle file drop
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setDraggedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setDroppedVideos([...droppedVideos, { name: file.name, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
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

  const handleDeleteDroppedVideo = (index) => {
    const updatedVideos = [...droppedVideos];
    updatedVideos.splice(index, 1);
    setDroppedVideos(updatedVideos);
    const updatedAmounts = [...amounts];
    updatedAmounts.splice(index, 1);
    setAmounts(updatedAmounts);
  };

  // Handle amount change
  const handleAmountChange = (index, value) => {
    const updatedAmounts = [...amounts];
    updatedAmounts[index] = value;
    setAmounts(updatedAmounts);
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

  // Handle unlock button
  const handleUnlock = (index) => {
    alert(`Pay ${clips[index].amount} to unlock this video`);
    // Here you would integrate your payment functionality
    const updatedClips = [...clips];
    updatedClips[index].unlocked = true;
    setClips(updatedClips);
  };

  return (
    <div
      className={`my-clips ${isDragging ? "border-2 border-pink-500" : ""}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
          className={`description-input ${isDragging ? 'dragging' : ''}`}
        >
          <div className="textarea-content">
            {droppedVideos.map((video, index) => (
              <div key={index} className="dropped-video">
                <p>{video.name}</p>
                <video src={video.preview} controls width="150" height="100"></video>
                <button
                  onClick={() => handleDeleteDroppedVideo(index)}
                  className="delete-video-button"
                >
                  <FaTimes />
                </button>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amounts[index] || ''}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  className="amount-input"
                />
              </div>
            ))}
          </div>
          {!draggedFile && (
            <textarea
              placeholder={
                isDragging
                  ? "Drop the file here..."
                  : "Type here something or drag and drop photos, audios, and videos here..."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ height: droppedVideos.length ? 'auto' : '150px' }}
            ></textarea>
          )}
        </div>
        <div className="upload-section">
          <label className="upload-label" htmlFor="upload-input">
            <FaCamera className="camera-icon" />
            Upload Video
          </label>
          <input type="file" accept="video/*" onChange={(e) => setDraggedFile(e.target.files[0])} className="upload-input" id="upload-input" ref={uploadBoxRef} />
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
                {clip.unlocked ? (
                  <video src={clip.preview} controls width="320" height="240"></video>
                ) : (
                  <div>
                    <p>Pay {clip.amount} to unlock this video</p>
                    <button onClick={() => handleUnlock(index)} className="unlock-button">
                      Unlock Video
                    </button>
                  </div>
                )}
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
