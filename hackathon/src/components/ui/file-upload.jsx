import { cn } from "@/lib/utils";
import { IconUpload } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import GridPattern from "./grid-pattern";

// Variants pour les animations
const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

// Composant FileUpload principal
export const FileUpload = ({ onChange }) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Gestion du changement de fichier
  const handleFileChange = (newFiles) => {
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="relative block w-full p-10 overflow-hidden rounded-lg cursor-pointer group/file"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <UploadOverlay />
        <UploadContent files={files} isDragActive={isDragActive} />
      </motion.div>
    </div>
  );
};

// Composant pour l'affichage du contenu des fichiers uploadés
const UploadContent = ({ files, isDragActive }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="relative z-20 font-sans text-base font-bold text-neutral-700 dark:text-neutral-300">
        Déposez votre cours
      </p>
      <p className="relative z-20 mt-2 font-sans text-base font-normal text-neutral-400 dark:text-neutral-400">
        Glissez ou déposez vos fichiers ici
      </p>
      <FileList files={files} isDragActive={isDragActive} />
    </div>
  );
};

// Composant pour l'affichage de la liste des fichiers
const FileList = ({ files, isDragActive }) => {
  return (
    <div className="relative w-full max-w-xl mx-auto mt-10">
      {files.length > 0 ? (
        files.map((file, idx) => (
          <FileItem key={file.name + idx} file={file} idx={idx} />
        ))
      ) : (
        <NoFilesPlaceholder isDragActive={isDragActive} />
      )}
    </div>
  );
};

// Composant pour un fichier spécifique
const FileItem = ({ file, idx }) => {
  return (
    <motion.div
      key={"file" + idx}
      layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
      className={cn(
        "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md shadow-sm"
      )}
    >
      <div className="flex items-center justify-between w-full gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
          className="max-w-xs text-base truncate text-neutral-700 dark:text-neutral-300"
        >
          {file.name}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
          className="flex-shrink-0 px-2 py-1 text-sm rounded-lg w-fit text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
        >
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </motion.p>
      </div>
      <div className="flex items-start justify-between w-full mt-2 text-sm md:items-center text-neutral-600 dark:text-neutral-400">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
          className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800"
        >
          {file.type}
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
          modified {new Date(file.lastModified).toLocaleDateString()}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Composant pour le placeholder si aucun fichier n'est présent
const NoFilesPlaceholder = ({ isDragActive }) => {
  return (
    <>
      <motion.div
        layoutId="file-upload"
        variants={mainVariant}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
        )}
      >
        {isDragActive ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-neutral-600"
          >
            Drop it
            <IconUpload className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </motion.p>
        ) : (
          <IconUpload className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
        )}
      </motion.div>
      <motion.div
        variants={secondaryVariant}
        className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
      />
    </>
  );
};

// Composant pour l'overlay de l'upload
const UploadOverlay = () => (
  <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
    <GridPattern />
  </div>
);
