import React, { useState } from "react";

interface CustomFileInputProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomFileInput = ({ handleFileUpload }: CustomFileInputProps) => {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    if (files.length) {
      handleFileUpload({
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div
      className={`flex items-center justify-center w-full h-64 border-2 ${
        dragging ? "border-blue-500" : "border-dashed"
      } rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label
        htmlFor="qr-input-file"
        className="flex flex-col items-center justify-center w-full h-full"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            aria-hidden="true"
            className="w-10 h-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16v-4m4 4v-4m4 4v-4m-4 8V8m4 4H8"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </p>
        </div>
        <input
          id="qr-input-file"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};

export default CustomFileInput;
