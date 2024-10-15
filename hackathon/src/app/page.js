"use client";

import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";

export default function FileUploadComponent() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (files) => {
    setUploadedFiles(files);
    console.log("Uploaded files:", files);
    // Here you would typically handle the file upload,
    // e.g., send to a server or process the files
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="mb-4 text-2xl font-bold">Importé votre fichier</h2>
      <FileUpload
        onFileUpload={handleFileUpload}
        maxFiles={5}
        maxSize={1024 * 1024 * 10} // 10 MB
        accept={["image/*", "application/pdf"]}
      />
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Uploaded Files:</h3>
          <ul className="pl-5 list-disc">
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
