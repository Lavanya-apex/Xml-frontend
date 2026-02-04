import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { validationAPI } from '@/services/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import type { Validation } from '@/types'

/** * IMPORTANT: If your Input component doesn't look like this, 
 * the onChange and value props won't reach the HTML element.
 */
const CustomInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        ref={ref}
        {...props}
      />
    )
  }
)
CustomInput.displayName = "Input"

export default function ValidateXML() {
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file')
  const [file, setFile] = useState<File | null>(null)
  const [xmlUrl, setXmlUrl] = useState("")
  const [validationResult, setValidationResult] = useState<Validation | null>(null)

  const brandDarkBlue = "w-full py-2 px-4 rounded bg-[#2D3748] hover:bg-[#1a202c] text-white font-medium transition-all disabled:opacity-50 flex justify-center items-center gap-2";

  // --- Mutations ---
  const validateFileMutation = useMutation({
    mutationFn: (file: File) => validationAPI.validateFile(file),
    onSuccess: (data) => setValidationResult(data),
    onError: (error: any) => alert(error.response?.data?.detail || 'Validation failed'),
  })

  const validateURLMutation = useMutation({
    mutationFn: (url: string) => validationAPI.validateURL(url),
    onSuccess: (data) => setValidationResult(data),
    onError: (error: any) => alert(error.response?.data?.detail || 'Validation failed'),
  })

  // --- Handlers ---
  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      validateFileMutation.mutate(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (xmlUrl) {
      validateURLMutation.mutate(xmlUrl);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle className="w-6 h-6 text-green-500" />
    if (status === 'failed') return <XCircle className="w-6 h-6 text-red-500" />
    return <AlertCircle className="w-6 h-6 text-yellow-500" />
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Validate XML</h1>
      
      <Card>
        <CardContent className="pt-6">
          {/* Tab Selection */}
          <div className="flex space-x-6 mb-8 border-b">
            <button 
              className={`pb-2 transition-colors ${activeTab === 'file' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-slate-500'}`} 
              onClick={() => { setActiveTab('file'); setValidationResult(null); }}
            >
              File Upload
            </button>
            <button 
              className={`pb-2 transition-colors ${activeTab === 'url' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-slate-500'}`} 
              onClick={() => { setActiveTab('url'); setValidationResult(null); }}
            >
              URL
            </button>
          </div>

          {/* Conditional Forms */}
          {activeTab === 'file' ? (
            <form onSubmit={handleFileSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Select XML File</label>
                <CustomInput 
                  type="file" 
                  accept=".xml"
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className={brandDarkBlue} 
                disabled={validateFileMutation.isPending || !file}
              >
                {validateFileMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Validate File
              </button>
            </form>
          ) : (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">XML URL</label>
                <CustomInput 
                  type="url" 
                  placeholder="https://example.com/data.xml" 
                  value={xmlUrl} 
                  onChange={(e) => setXmlUrl(e.target.value)} 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className={brandDarkBlue} 
                disabled={validateURLMutation.isPending || !xmlUrl}
              >
                {validateURLMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Validate URL
              </button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Result Display */}
      {validationResult && (
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(validationResult.status)} 
              Validation Results 
              <span className="text-sm font-normal text-slate-500 ml-auto">
                Status: {validationResult.status.toUpperCase()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-slate-900 p-4">
              <pre className="text-xs text-slate-100 overflow-auto max-h-[400px]">
                {JSON.stringify(validationResult.results, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}