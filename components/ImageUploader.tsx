import React, { useState, useRef, useCallback } from 'react';
import type { UploadedImage } from '../types';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage) => void;
}

const fileToData = (file: File): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      if (base64) {
        resolve({ base64, mimeType: file.type });
      } else {
        reject(new Error("Failed to read file as base64"));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      try {
        const imageData = await fileToData(file);
        setPreview(URL.createObjectURL(file));
        onImageUpload(imageData);
      } catch (error) {
        console.error("Error processing file:", error);
        // You might want to show an error to the user here
      }
    }
  }, [onImageUpload]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };
  
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files)}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative w-full h-48 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center text-center transition-colors duration-300
          ${isDragging ? 'border-cyan-400 bg-cyan-900/20' : 'border-gray-600 hover:border-cyan-500 bg-gray-700/50'}`}
      >
        {preview ? (
          <img src={preview} alt="产品预览" className="w-full h-full object-contain rounded-lg p-2" />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <UploadIcon />
            <p className="mt-2 font-semibold">点击上传</p>
            <p className="text-sm">或拖拽文件至此</p>
          </div>
        )}
      </div>
    </div>
  );
}