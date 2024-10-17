"use client";

import { FlipCard } from "@/components/flip-card";
import { FileUpload } from "@/components/ui/file-upload";
import { RainbowButton } from "@/components/ui/rainbow-button";
import SparklesText from "@/components/ui/sparkles-text";
import TypingAnimation from "@/components/ui/typing-animation";
import "loaders.css/loaders.min.css";
import { useState } from "react";
import Loader from "react-loaders";

export default function FileUploadComponent() {
  const [state, setState] = useState({
    uploadedFiles: [],
    apiResponse: null,
    isLoading: false, // Ajout de l'état de chargement
  });

  // Gestion de l'upload des fichiers
  const handleFileUpload = (files) => {
    setState((prevState) => ({
      ...prevState,
      uploadedFiles: files,
    }));
  };

  // Fonction pour uploader le PDF et obtenir la question extraite
  const handleUploadPdf = async () => {
    if (!state.uploadedFiles.length) {
      alert("Veuillez sélectionner un fichier à uploader.");
      return;
    }

    setState((prevState) => ({
      ...prevState,
      isLoading: true, // Active le mode chargement
    }));

    try {
      const file = state.uploadedFiles[0];
      const response = await uploadFile(file);
      const data = await response.json();
      await fetchAnswer(data.text);
    } catch (error) {
      handleError("Erreur: Impossible d'extraire le texte.", error);
    } finally {
      setState((prevState) => ({
        ...prevState,
        isLoading: false, // Désactive le mode chargement
      }));
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
      isLoading: false,
    });
  };

  return (
    <div className="flex flex-col items-center max-w-md p-4 mx-auto mt-10">
      {/* Section du téléchargement */}
      <SparklesText
        text="Générer des flashcards"
        className="items-center justify-center text-4xl font-bold"
      />
      <TypingAnimation
        className="text-4xl font-bold text-black dark:text-white"
        duration={80}
        text="à partir de vos cours PDF"
      />
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

      {/* Loader visible pendant le chargement */}
      {state.isLoading && (
        <div className="flex justify-center mt-12">
          <Loader type="ball-clip-rotate-multiple" active color="#F0F0F0" />
        </div>
      )}

      {/* FlipCard centré sous le bouton une fois la réponse disponible */}
      {state.apiResponse && !state.isLoading && (
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
