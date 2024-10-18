"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Propriétés d'animation définies séparément pour une meilleure lisibilité
const animationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
};

// Composant ShinyButton
const ShinyButton = ({ children, className, ...props }) => {
  return (
    <motion.button
      {...animationProps}
      {...props}
      className={cn(
        "relative rounded-lg px-6 py-2 font-medium border-2 border-gray-300 text-gray-600 backdrop-blur-lg transition-shadow duration-300 ease-in-out hover:shadow-md", // Couleurs neutres
        "bg-white hover:bg-gray-100", // Fond blanc avec survol gris léger
        className
      )}
    >
      <ButtonContent>{children}</ButtonContent>
      <ButtonOverlay />
    </motion.button>
  );
};

// Composant pour le contenu du bouton
const ButtonContent = ({ children }) => (
  <span
    className="relative block text-sm tracking-wide text-gray-600 uppercase size-full" // Texte en gris
    style={{
      maskImage:
        "linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))",
    }}
  >
    {children}
  </span>
);

// Composant pour l'overlay du bouton
const ButtonOverlay = () => (
  <span
    style={{
      mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
      maskComposite: "exclude",
    }}
    className="absolute inset-0 z-10 block rounded-[inherit] bg-gray-200 p-px" // Overlay léger gris
  />
);

export default ShinyButton;
