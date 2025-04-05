import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline, IoClose } from "react-icons/io5";

const ImageUploader = ({ onFileUpload }) => {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setFiles([fileWithPreview]); // Only one file
      onFileUpload(file); // Notify parent
    },
  });

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
    else return `${(size / 1048576).toFixed(1)} MB`;
  };

  const handleRemove = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview));
    setFiles([]);
    onFileUpload(null); // Notify parent that image is removed
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <section className="text-center">
      <div
        {...getRootProps({
          className:
            "border-2 border-dashed border-M-text-color/10 p-8 text-center cursor-pointer hover:bg-gray-100 rounded-md relative",
        })}
      >
        <IoCloudUploadOutline size={36} className="mx-auto text-M-text-color" />
        <h4 className="text-M-text-color font-inter font-medium text-base mt-2 mb-1">
          Drop files here or click to upload.
        </h4>
        <input {...getInputProps()} />
        <p className="text-M-text-color text-xs">
          Drag & drop your file here, or click to select
        </p>
      </div>

      {files.length > 0 && (
        <aside className="flex flex-wrap mt-4">
          {files.map((file) => (
            <div
              className="relative inline-flex gap-3 items-center border border-gray-300 rounded-md w-full h-auto px-3 py-4"
              key={file.name}
            >
              <div className="flex min-w-0 overflow-hidden">
                <img
                  src={file.preview}
                  className="block w-14 border border-M-heading-color/10 rounded-md p-1"
                  alt={file.name}
                />
              </div>
              <div className="flex flex-col text-left flex-1">
                <span className="text-sm text-M-text-color/60 font-inter font-semibold mb-1 truncate">
                  {file.name}
                </span>
                <span className="text-xs text-M-text-color font-inter font-medium">
                  {formatFileSize(file.size)}
                </span>
              </div>

              {/* ❌ Remove Button */}
              <button
                onClick={handleRemove}
                className="ml-auto text-red-500 hover:text-red-700"
                title="Remove image"
              >
                <IoClose size={20} />
              </button>
            </div>
          ))}
        </aside>
      )}
    </section>
  );
};

export default ImageUploader;
