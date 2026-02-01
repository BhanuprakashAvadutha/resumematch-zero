"use client";
import { useState, useRef } from "react";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X } from "lucide-react";
import { Resume } from "@/types/resume";

interface ImportResumeProps {
    onImport: (data: Partial<Resume>) => void;
    onClose: () => void;
}

export default function ImportResume({ onImport, onClose }: ImportResumeProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");
    const [parsedData, setParsedData] = useState<Partial<Resume> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.type === "application/pdf") {
            processFile(droppedFile);
        } else {
            setErrorMessage("Please upload a PDF file");
            setStatus('error');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const processFile = async (uploadedFile: File) => {
        setFile(uploadedFile);
        setStatus('parsing');
        setErrorMessage("");

        try {
            // Create FormData and send to API for parsing
            const formData = new FormData();
            formData.append("file", uploadedFile);

            const response = await fetch("/api/parse-resume", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to parse resume");
            }

            const data = await response.json();
            setParsedData(data);
            setStatus('success');
        } catch (error) {
            console.error("Parse error:", error);
            setErrorMessage(error instanceof Error ? error.message : "Failed to parse resume");
            setStatus('error');
        }
    };

    const handleConfirmImport = () => {
        if (parsedData) {
            onImport(parsedData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-400" />
                        Import Resume
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {status === 'idle' && (
                        <>
                            {/* Drop Zone */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                                    }`}
                            >
                                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-blue-400" />
                                </div>
                                <p className="text-white font-medium mb-2">
                                    Drag & drop your resume here
                                </p>
                                <p className="text-gray-400 text-sm mb-4">
                                    or click to browse
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Supports PDF files only
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <p className="text-gray-500 text-xs mt-4 text-center">
                                We'll extract your information and auto-fill the form.
                                You can edit any field manually after import.
                            </p>
                        </>
                    )}

                    {status === 'parsing' && (
                        <div className="text-center py-8">
                            <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                            <p className="text-white font-medium mb-2">Parsing your resume...</p>
                            <p className="text-gray-400 text-sm">{file?.name}</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <p className="text-white font-medium mb-2">Failed to parse resume</p>
                            <p className="text-red-400 text-sm mb-6">{errorMessage}</p>
                            <button
                                onClick={() => { setStatus('idle'); setFile(null); }}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {status === 'success' && parsedData && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                                <div>
                                    <p className="text-white font-medium">Resume parsed successfully!</p>
                                    <p className="text-green-400 text-sm">Ready to import</p>
                                </div>
                            </div>

                            {/* Preview of parsed data */}
                            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3 max-h-64 overflow-y-auto">
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Extracted Data</h3>

                                {parsedData.full_name && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Name:</span>
                                        <p className="text-white">{parsedData.full_name}</p>
                                    </div>
                                )}
                                {parsedData.email && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Email:</span>
                                        <p className="text-white">{parsedData.email}</p>
                                    </div>
                                )}
                                {parsedData.experiences && parsedData.experiences.length > 0 && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Experience:</span>
                                        <p className="text-white">{parsedData.experiences.length} positions found</p>
                                    </div>
                                )}
                                {parsedData.education && parsedData.education.length > 0 && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Education:</span>
                                        <p className="text-white">{parsedData.education.length} entries found</p>
                                    </div>
                                )}
                                {parsedData.skills && parsedData.skills.length > 0 && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Skills:</span>
                                        <p className="text-white">{parsedData.skills.reduce((acc, s) => acc + s.items.length, 0)} skills found</p>
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-500 text-xs text-center">
                                Missing data? You can fill in any empty fields manually after import.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setStatus('idle'); setFile(null); setParsedData(null); }}
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                                >
                                    Upload Different File
                                </button>
                                <button
                                    onClick={handleConfirmImport}
                                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
                                >
                                    Import Resume
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
