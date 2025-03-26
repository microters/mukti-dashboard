import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";

const ImageUploader = (props) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  // Function to format the file size in a human-readable format
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
    else return `${(size / 1048576).toFixed(1)} MB`;
  };

  const thumbs = files.map((file) => (
    <div
      className="inline-flex gap-3 items-center border border-gray-300 rounded-md w-full h-auto px-3 py-4"
      key={file.name}
    >
      <div className="flex min-w-0 overflow-hidden">
        <img
          src={file.preview}
          className="block w-14 border border-M-heading-color/10 rounded-md p-1"
          onLoad={() => {
            // Revoke data uri after image is loaded to avoid memory leaks
            URL.revokeObjectURL(file.preview);
          }}
          alt={file.name}
        />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-sm text-M-text-color/60 font-inter font-semibold mb-1 truncate">
          {file.name}
        </span>
        <span className="text-xs text-M-text-color font-inter font-medium">
          {formatFileSize(file.size)}
        </span>
      </div>
    </div>
  ));

  useEffect(() => {
    // Revoke the data URIs to avoid memory leaks when component unmounts
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="text-center ">
      <div
        {...getRootProps({
          className:
            "border-2 border-dashed border-M-text-color/10 p-8 text-center cursor-pointer hover:bg-gray-100 rounded-md",
        })}
      >
        <IoCloudUploadOutline size={36} className="mx-auto text-M-text-color" />
        <h4 className="text-M-text-color font-inter font-medium text-base mt-2 mb-1">
          Drop files here or click to upload.
        </h4>
        <input {...getInputProps()} />
        <p className="text-M-text-color text-xs">
          Drag & drop Your files here, or click to select files
        </p>
      </div>
      <aside className="flex flex-wrap mt-4">{thumbs}</aside>
    </section>
  );
};

export default ImageUploader;
