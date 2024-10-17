"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Composant TypingAnimation pour l'effet de texte
export default function TypingAnimation({ text, duration = 200, className }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const typingEffect = setInterval(() => {
        updateDisplayedText();
      }, duration);

      return () => clearInterval(typingEffect);
    }
  }, [currentIndex, text, duration]);

  // Fonction pour mettre à jour le texte affiché
  const updateDisplayedText = () => {
    setDisplayedText(text.substring(0, currentIndex + 1));
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <h1
      className={cn(
        "font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
        className
      )}
    >
      {displayedText || text}
    </h1>
  );
}
