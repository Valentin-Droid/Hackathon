"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export default function FileUploadComponent() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [filePath, setFilePath] = useState(""); // Store the filePath
    const [generatedContent, setGeneratedContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userPrompt, setUserPrompt] = useState(""); // To capture the user prompt

    const handleFileUpload = async (files) => {
        if (files.length > 0) {
            const fileArray = Array.isArray(files) ? files : [files];
            setUploadedFiles(fileArray); // Set uploadedFiles as an array

            // Prepare the request for file upload
            const formData = new FormData();
            formData.append("file", files[0]); // Only take the first file

            try {
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();

                // Check the server response
                if (data.filePath) {
                    console.log("File uploaded to:", data.filePath);
                    setFilePath(data.filePath); // Store the filePath
                } else {
                    console.error("No filePath returned");
                }
            } catch (error) {
                console.error("Error during upload:", error);
            }
        }
    };

    const handleContentGeneration = async () => {
        console.log("Generating content for file:", filePath);
        setLoading(true);
        try {
            const res = await fetch("/api/generate-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filePath, prompt: userPrompt }),
            });

            const data = await res.json();

            // Ensure the generation was successful and the file was created
            if (data.generatedPdfPath) {
                console.log("Content generated, file saved to:", data.generatedPdfPath);
                setGeneratedContent(data.generatedPdfPath); // Update the path of the generated file
            }

            setLoading(false);
        } catch (error) {
            console.error("Error during content generation:", error);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="mb-4 text-2xl font-bold">Upload your PDF file</h2>
            <FileUpload
                onFileUpload={handleFileUpload}
                maxFiles={5}
                maxSize={1024 * 1024 * 10} // 10 MB
                accept={["application/pdf"]}
            />
            {uploadedFiles.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Uploaded files:</h3>
                    <ul className="pl-5 list-disc">
                        {uploadedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Content generation request */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold">Request content processing</h3>
                <input
                    type="text"
                    className="mt-2 p-2 border border-gray-300 rounded"
                    placeholder="Enter your request here"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                />
                <button
                    className="ml-2 mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => {
                        console.log("Button clicked, generating content...");
                        handleContentGeneration();
                    }}
                    disabled={loading || !userPrompt}
                >
                    {loading ? "Generating..." : "Generate Content"}
                </button>
            </div>

            {/* Display generated file */}
            {generatedContent && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Generated Content:</h3>
                    <a
                        href={`/uploads/generated-content.pdf`} // Path to the generated file
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                    >
                        Download Generated PDF
                    </a>
                </div>
            )}
        </div>
    );
}