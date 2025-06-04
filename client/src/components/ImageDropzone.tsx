/**
 * @file: ImageDropzone.tsx
 * @description: Дропзона для загрузки изображений
 * @dependencies: react-dropzone
 * @created: 2024-06-06
 */

import { useDropzone } from 'react-dropzone';

interface ImageDropzoneProps {
  onFileAccepted: (file: File) => void
}

export function ImageDropzone({ onFileAccepted }: ImageDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => onFileAccepted(acceptedFiles[0]),
  });

  return (
    <div {...getRootProps()} className="border-dashed border-2 p-8 rounded-lg text-center">
      <input {...getInputProps()} />
      {isDragActive ? "Отпустите файл для загрузки" : "Перетащите изображение или кликните для выбора"}
    </div>
  );
} 