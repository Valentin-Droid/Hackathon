"use client";

import { FileUpload } from "@/components/ui/file-upload";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useState } from "react";

export default function FileUploadComponent() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [apiResponse, setApiResponse] = useState(null); // State to store API response

  const handleFileUpload = (files) => {
    setUploadedFiles(files);
  };

  const getAnswer = async () => {
    try {
      const response = await fetch("/api/openAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: "What is the capital of France?",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the API");
      }

      const data = await response.json(); // Parse response as JSON
      setApiResponse(data.result); // Store the API response in state
    } catch (error) {
      console.error("Error fetching the API:", error);
      setApiResponse("Error: Unable to get the answer.");
    }
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
      <RainbowButton onClick={getAnswer} className="mt-6">
        Upload
      </RainbowButton>
      {apiResponse && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Response:</h3>
          <p>{apiResponse}</p>
        </div>
      )}
    </div>
  );
}
