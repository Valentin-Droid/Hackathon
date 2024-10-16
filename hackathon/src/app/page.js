"use client";

import { FileUpload } from "@/components/ui/file-upload";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useState } from "react";

export default function FileUploadComponent() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [apiResponse, setApiResponse] = useState(null); // State to store API response

  const handleFileUpload = (files) => {
    console.log("Uploaded files:", files);
    setUploadedFiles(files);
  };

  const uploadPdf = async () => {
    if (uploadedFiles.length === 0) {
      alert("Veuillez sélectionner un fichier à uploader.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFiles[0]); // On suppose un seul fichier pour simplifier

    try {
      const response = await fetch("http://localhost:3001/extract-pdf-text", {
        method: "POST",
        body: formData, // Envoie le fichier sous forme de FormData
      });

      if (!response.ok) {
        throw new Error("L'upload du fichier a échoué.");
      }

      const data = await response.json();
      setApiResponse(data.text); // Stocke la réponse texte extraite

      // Maintenant que l'upload est terminé et que apiResponse est mis à jour, appelle getAnswer()
      await getAnswer(data.text); // Passe le texte extrait à getAnswer()
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      setApiResponse("Erreur: Impossible d'extraire le texte.");
    }
  };

  const getAnswer = async (extractedText) => {
    try {
      const response = await fetch("/api/openAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "system",
          content: "",
          question: extractedText, // Utilise le texte extrait du PDF
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the API");
      }

      const data = await response.json(); // Parse response as JSON
      setApiResponse(data.result); // Stocke la réponse de l'API OpenAI dans apiResponse
    } catch (error) {
      console.error("Error fetching the API:", error);
      setApiResponse("Error: Unable to get the answer.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="mb-4 text-2xl font-bold">Importé votre fichier</h2>
      <FileUpload
        onChange={handleFileUpload}
        maxFiles={1}
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
      <RainbowButton onClick={uploadPdf} className="mt-6">
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
