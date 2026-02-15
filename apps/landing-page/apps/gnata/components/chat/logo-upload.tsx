"use client";

import { useState, useRef } from "react";
import { UploadIcon, XIcon, FileIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LogoUploadProps {
    onUpload?: (file: File) => void;
    isUploaded?: boolean;
}

export function LogoUpload({ onUpload, isUploaded: initialIsUploaded = false }: LogoUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploaded, setIsUploaded] = useState(initialIsUploaded);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (selectedFile.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(selectedFile));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
            if (droppedFile.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(droppedFile));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleUpload = () => {
        if (file) {
            setIsUploaded(true);
            onUpload?.(file);
        }
    };

    const removeFile = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(null);
        setPreviewUrl(null);
        setIsUploaded(false);
    };

    if (isUploaded) {
        return (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 animate-in fade-in zoom-in duration-300">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden border border-primary/10">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Logo preview" className="size-full object-cover" />
                    ) : (
                        <CheckIcon className="size-5" />
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Logo envoyé avec succès !</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{file?.name || "logo.png"}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={removeFile} className="h-8 text-xs hover:bg-primary/5">
                    Changer
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all cursor-pointer",
                    isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-secondary/50",
                    file ? "border-primary/50 bg-primary/5" : ""
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />

                {file ? (
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex size-16 items-center justify-center rounded-xl bg-primary/10 text-primary overflow-hidden border border-primary/10">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="size-full object-cover" />
                            ) : (
                                <FileIcon className="size-8" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-secondary">
                            <UploadIcon className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Cliquez ou glissez votre logo ici</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG ou SVG (max. 2MB)</p>
                    </>
                )}

                {file && !isDragging && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-background transition-colors"
                    >
                        <XIcon className="size-4 text-muted-foreground" />
                    </button>
                )}
            </div>

            {file && (
                <Button onClick={handleUpload} className="w-full h-9 text-sm" size="sm">
                    Valider le logo
                </Button>
            )}
        </div>
    );
}
