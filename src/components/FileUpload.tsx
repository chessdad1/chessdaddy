import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import '../styles/FileUpload.css';

interface FileUploadProps {
  onFileSelect: (content: string) => void;
  accept?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.pgn,.txt',
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      onFileSelect(content);
    } catch (error) {
      alert('Failed to read file');
    }
  };

  return (
    <div className="file-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        style={{ display: 'none' }}
      />
      <button
        className="upload-btn"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <Upload size={20} />
        Upload PGN File
      </button>
    </div>
  );
};

export default FileUpload;
