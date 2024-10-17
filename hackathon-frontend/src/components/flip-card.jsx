"use client";

import { Card } from "@/components/ui/card";
import ShinyButton from "@/components/ui/shiny-button"; // Correction du nom importé
import { useState } from "react";

// Composant FlipCard
export function FlipCard({ frontContent, backContent }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped((prevState) => !prevState);
  };

  return (
    <div className="flip-card w-64 h-96 [perspective:1000px]">
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        } shadow-lg rounded-xl`}
      >
        {/* Recto */}
        <FlipCardSide
          content={
            frontContent || (
              <CardContent title="Recto" text="Ceci est la face avant" />
            )
          }
          handleFlip={handleFlip}
          isBackSide={false}
        />

        {/* Verso */}
        <FlipCardSide
          content={
            backContent || (
              <CardContent title="Verso" text="Ceci est la face arrière" />
            )
          }
          handleFlip={handleFlip}
          isBackSide={true}
        />
      </div>
    </div>
  );
}

// Composant pour afficher le contenu d'une carte
function CardContent({ title, text }) {
  return (
    <div className="text-center">
      <h2 className="mb-4 text-2xl font-bold text-gray-600">{title}</h2>
      <p className="mb-4 text-gray-600">{text}</p>
    </div>
  );
}

// Composant générique pour un côté de la carte
function FlipCardSide({ content, handleFlip, isBackSide }) {
  return (
    <div
      className={`absolute w-full h-full [backface-visibility:hidden] ${
        isBackSide ? "[transform:rotateY(180deg)]" : ""
      }`}
    >
      <Card className="flex flex-col justify-between w-full h-full p-4 bg-white border-2 border-gray-300 rounded-lg shadow-md">
        {/* Conteneur pour le contenu avec centrage */}
        <div className="flex items-center justify-center flex-1 text-center text-gray-600 max-h-64">
          {content}
        </div>
        <ShinyButton onClick={handleFlip}>
          {isBackSide ? "Question" : "Réponse"}
        </ShinyButton>
      </Card>
    </div>
  );
}
