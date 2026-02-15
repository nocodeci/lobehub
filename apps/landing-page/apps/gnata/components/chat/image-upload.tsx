"use client";

import { useState, useRef } from "react";
import { UploadIcon, XIcon, FileIcon, CheckIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    onUpload?: (files: File[]) => void;
    isUploaded?: boolean;
}

export function ImageUpload({ onUpload, isUploaded: initialIsUploaded = false }: ImageUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploaded, setIsUploaded] = useState(initialIsUploaded);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length > 0) {
            addFiles(selectedFiles);
        }
    };

    const addFiles = (newFiles: File[]) => {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);

        const newPreviews = newFiles.map(file =>
            file.type.startsWith('image/') ? URL.createObjectURL(file) : ""
        );
        setPreviews([...previews, ...newPreviews]);
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
        const droppedFiles = Array.from(e.dataTransfer.files || []);
        if (droppedFiles.length > 0) {
            addFiles(droppedFiles);
        }
    };

    const handleUpload = () => {
        if (files.length > 0) {
            setIsUploaded(true);
            onUpload?.(files);
        }
    };

    const removeFile = (index: number) => {
        if (previews[index]) URL.revokeObjectURL(previews[index]);
        const newFiles = [...files];
        const newPreviews = [...previews];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setFiles(newFiles);
        setPreviews(newPreviews);
        if (newFiles.length === 0) setIsUploaded(false);
    };

    const resetAll = () => {
        previews.forEach(url => url && URL.revokeObjectURL(url));
        setFiles([]);
        setPreviews([]);
        setIsUploaded(false);
    };

    if (isUploaded) {
        return (
            <div className="mt-3 flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckIcon className="size-4" />
                        </div>
                        <p className="text-sm font-medium text-foreground">{files.length} image(s) envoyée(s) !</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={resetAll} className="h-8 text-xs hover:bg-primary/5">
                        Changer
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {previews.map((url, i) => (
                        <div key={i} className="size-12 rounded-lg border border-primary/20 overflow-hidden bg-background">
                            {url ? (
                                <img src={url} alt="Preview" className="size-full object-cover" />
                            ) : (
                                <div className="size-full flex items-center justify-center text-muted-foreground">
                                    <FileIcon className="size-4" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
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
                    files.length > 0 ? "border-primary/30 bg-primary/5" : ""
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                    multiple
                />

                {files.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 w-full">
                        {files.map((file, i) => (
                            <div key={i} className="relative group shrink-0">
                                <div className="aspect-square rounded-lg bg-primary/10 text-primary overflow-hidden border border-primary/10 flex items-center justify-center">
                                    {previews[i] ? (
                                        <img src={previews[i]} alt="Preview" className="size-full object-cover" />
                                    ) : (
                                        <FileIcon className="size-6" />
                                    )}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(i);
                                    }}
                                    className="absolute -top-1 -right-1 p-0.5 rounded-full bg-background border border-border shadow-sm group-hover:bg-destructive group-hover:text-destructive-foreground transition-colors"
                                >
                                    <XIcon className="size-3" />
                                </button>
                            </div>
                        ))}
                        <div className="aspect-square rounded-lg border border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors">
                            <UploadIcon className="size-5 text-muted-foreground" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-secondary">
                            <ImageIcon className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Cliquez ou glissez vos images ici</p>
                        <p className="text-xs text-muted-foreground">Photos de produits, réalisations, etc.</p>
                    </>
                )}
            </div>

            {files.length > 0 && (
                <Button onClick={handleUpload} className="w-full h-9 text-sm" size="sm">
                    Valider les images ({files.length})
                </Button>
            )}
        </div>
    );
}
