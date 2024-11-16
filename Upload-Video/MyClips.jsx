import React, { useState } from 'react';
import './MyClips.css';
import { FaCamera } from 'react-icons/fa';

function MyClips() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clips, setClips] = useState([]);
  const [preview, setPreview] = useState(null);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setClips([...clips, { file, preview: URL.createObjectURL(file) }]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setClips([...clips, { file, preview: URL.createObjectURL(file) }]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Clips:', clips);
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
        >
          <textarea
            placeholder="Type here something or drag and drop photos, audios and videos here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="upload-section">
          <label className="upload-label" htmlFor="upload-input">
            <FaCamera className="camera-icon" />
            Upload
          </label>
          <input type="file" accept="video/*" onChange={handleUpload} className="upload-input" id="upload-input" />
          <button className="add-clips-button" onClick={handleSubmit}>Add Clips</button>
        </div>
        {preview && (
          <div className="preview">
            <video src={preview} controls width="320" height="240"></video>
          </div>
        )}
      </section>
    </div>
  );
}

export default MyClips;
