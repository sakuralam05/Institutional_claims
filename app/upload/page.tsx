"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react"

interface UploadedFile {
  id: string
  file: File
  status: "uploading" | "success" | "error"
  progress: number
  error?: string
}

export default function UploadPage() {
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const allowedTypes = [
    "application/pdf",
    "text/html",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]
  const allowedExtensions = [".pdf", ".html", ".docx", ".txt"]

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type) && !allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      return "Invalid file type. Please upload PDF, HTML, DOCX, or TXT files."
    }
    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      return "File size too large. Please upload files smaller than 50MB."
    }
    return null
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "success", progress: 100 } : f)))
      } else {
        setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
      }
    }, 200)
  }

  const handleFiles = useCallback((files: FileList) => {
    const newFiles: UploadedFile[] = []

    Array.from(files).forEach((file) => {
      const error = validateFile(file)
      const fileId = Math.random().toString(36).substr(2, 9)

      if (error) {
        newFiles.push({
          id: fileId,
          file,
          status: "error",
          progress: 0,
          error,
        })
      } else {
        newFiles.push({
          id: fileId,
          file,
          status: "uploading",
          progress: 0,
        })
        // Simulate upload
        setTimeout(() => simulateUpload(fileId), 100)
      }
    })

    setUploadedFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const hasValidFiles = uploadedFiles.some((f) => f.status === "success")
  const hasErrors = uploadedFiles.some((f) => f.status === "error")

  const proceedToConfiguration = () => {
    if (hasValidFiles) {
      router.push("/configure")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Documents</h1>
          <p className="text-gray-600">
            Upload your institutional reports for AI-powered claim verification. Supported formats: PDF, HTML, DOCX, TXT
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>
              Drag and drop your files here or click to browse. Maximum file size: 50MB per file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-900 mb-2">Drop your documents here</p>
                <p className="text-gray-600">or click to browse your files</p>
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.html,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Browse Files
                </label>
              </Button>
              <div className="mt-4 text-sm text-gray-500">Supported formats: PDF, HTML, DOCX, TXT</div>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedFiles.map((uploadedFile) => (
                  <div key={uploadedFile.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.file.name}</p>
                        <p className="text-sm text-gray-500">{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        {uploadedFile.status === "uploading" && (
                          <Progress value={uploadedFile.progress} className="mt-2" />
                        )}
                        {uploadedFile.error && <p className="text-sm text-red-600 mt-1">{uploadedFile.error}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {uploadedFile.status === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {uploadedFile.status === "error" && <AlertCircle className="h-5 w-5 text-red-600" />}
                      <Button variant="ghost" size="sm" onClick={() => removeFile(uploadedFile.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Messages */}
        {hasErrors && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some files failed to upload. Please check the file formats and sizes, then try again.
            </AlertDescription>
          </Alert>
        )}

        {hasValidFiles && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Files uploaded successfully! You can now proceed to configure your analysis.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
          <Button onClick={proceedToConfiguration} disabled={!hasValidFiles} className="bg-blue-600 hover:bg-blue-700">
            Configure Analysis
          </Button>
        </div>
      </main>
    </div>
  )
}
