"use client";

import { FlipCard } from "@/components/flip-card";
import { FileUpload } from "@/components/ui/file-upload";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useState } from "react";

// Composant principal de téléchargement de fichier et affichage des réponses
export default function FileUploadComponent() {
  const [state, setState] = useState({
    uploadedFiles: [],
    apiResponse: null,
  });

  // Gestion de l'upload des fichiers
  const handleFileUpload = (files) => {
    setState((prevState) => ({ ...prevState, uploadedFiles: files }));
  };

  // Fonction pour uploader le PDF et obtenir la question extraite
  const handleUploadPdf = async () => {
    if (!state.uploadedFiles.length) {
      alert("Veuillez sélectionner un fichier à uploader.");
      return;
    }

    try {
      const file = state.uploadedFiles[0];
      const response = await uploadFile(file);

      const data = await response.json();
      await fetchAnswer(data.text);
    } catch (error) {
      handleError("Erreur: Impossible d'extraire le texte.", error);
    }
  };

  // Fonction pour faire l'upload du fichier
  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return fetch("http://localhost:3001/extract-pdf-text", {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        throw new Error("L'upload du fichier a échoué.");
      }
      return response;
    });
  };

  // Fonction pour obtenir la réponse de l'API OpenAI
  const fetchAnswer = async (extractedText) => {
    try {
      const response = await fetch("/api/openAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "system",
          content: "",
          question: extractedText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the API");
      }

      const data = await response.json();
      const parsedResult = parseApiResponse(data.result);
      setState((prevState) => ({
        ...prevState,
        apiResponse: parsedResult,
      }));
    } catch (error) {
      handleError("Impossible d'obtenir la réponse.", error);
    }
  };

  // Fonction pour parser la réponse de l'API OpenAI
  const parseApiResponse = (responseText) => {
    const cleanedResult = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedResult);
  };

  // Fonction pour gérer les erreurs et mettre à jour l'état
  const handleError = (errorMessage, error) => {
    console.error(errorMessage, error);
    setState({
      uploadedFiles: [],
      apiResponse: { question: "Erreur", answer: errorMessage },
    });
  };

  return (
    <div className="flex flex-col items-center max-w-md p-4 mx-auto mt-10">
      {/* Section du téléchargement */}
      <h2 className="mb-4 text-2xl font-bold text-center">
        Importez votre fichier
      </h2>
      <FileUpload
        onChange={handleFileUpload}
        maxFiles={1}
        maxSize={1024 * 1024 * 10}
        accept={["application/pdf"]}
      />

      {/* Bouton centré, visible seulement si un fichier est uploadé */}
      {state.uploadedFiles.length > 0 && (
        <RainbowButton onClick={handleUploadPdf} className="mt-6">
          Générer une flashcard
        </RainbowButton>
      )}

      {/* FlipCard centré sous le bouton */}
      {state.apiResponse && (
        <div className="flex justify-center mt-8">
          <FlipCard
            frontContent={<p>{state.apiResponse.question}</p>}
            backContent={<p>{state.apiResponse.answer}</p>}
          />
        </div>
      )}
    </div>
  );
}
