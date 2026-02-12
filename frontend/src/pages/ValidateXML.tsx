
import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { validationAPI } from '@/services/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import type { Validation } from '@/types'

// --- Custom Input Component ---
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
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'file' | 'url' | 'path'>('file')
  
  // Input States
  const [file, setFile] = useState<File | null>(null)
  const [xmlUrl, setXmlUrl] = useState("")
  const [filePath, setFilePath] = useState("")
  
  // Validation Results
  const [validationResult, setValidationResult] = useState<Validation | null>(null)
  
  // NEW: Tracking if the current input has already been submitted
  const [isSubmitted, setIsSubmitted] = useState(false)

  const brandDarkBlue = "w-full py-2 px-4 rounded bg-[#2D3748] hover:bg-[#1a202c] text-white font-medium transition-all disabled:opacity-50 flex justify-center items-center gap-2";

  const refreshAppData = () => {
    queryClient.invalidateQueries({ queryKey: ['validations'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
  }

  // --- Mutations ---
  const validateMutation = useMutation({
    mutationFn: (data: File | string) => {
      if (activeTab === 'file') return validationAPI.validateFile(data as File);
      if (activeTab === 'url') return validationAPI.validateURL(data as string);
      return validationAPI.validatePath(data as string);
    },
    onSuccess: (data) => {
      setValidationResult(data);
      setIsSubmitted(true); 
      refreshAppData();
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || 'Validation failed');
      setIsSubmitted(false); // Allow retry on error
    },
  })

  // --- Handlers ---
  const handleTabChange = (tab: 'file' | 'url' | 'path') => {
    setActiveTab(tab)
    setValidationResult(null)
    setIsSubmitted(false) // Reset lock when switching tabs
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === 'file' && file) validateMutation.mutate(file)
    else if (activeTab === 'url' && xmlUrl) validateMutation.mutate(xmlUrl)
    else if (activeTab === 'path' && filePath) validateMutation.mutate(filePath)
  }

  //Reset "isSubmitted" whenever the input content changes
  const onInputChange = () => {
    if (isSubmitted) {
        setIsSubmitted(false);
        setValidationResult(null); // Optional: clear result when user starts typing again
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Validate XML</h1>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-6 mb-8 border-b">
            {(['file', 'url', 'path'] as const).map((tab) => (
              <button 
                key={tab}
                className={`pb-2 capitalize transition-colors ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-slate-500'}`} 
                onClick={() => handleTabChange(tab)}
              >
                {tab === 'file' ? 'File Upload' : tab === 'url' ? 'URL' : 'Local Path'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'file' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Select XML File</label>
                <input
                  type="file" 
                  accept=".xml"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    onInputChange(); 
                  }}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                  required 
                />
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">XML URL</label>
                <CustomInput 
                  type="url" 
                  placeholder="https://example.com/data.xml" 
                  value={xmlUrl} 
                  onChange={(e) => {
                    setXmlUrl(e.target.value);
                    onInputChange(); 
                  }} 
                  required 
                />
              </div>
            )}

            {activeTab === 'path' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Local File Path</label>
                <CustomInput 
                  type="text" 
                  placeholder="C:/Users/name/Desktop/file.xml" 
                  value={filePath} 
                  onChange={(e) => {
                    setFilePath(e.target.value);
                    onInputChange(); 
                  }} 
                  required 
                />
              </div>
            )}

            <button 
                type="submit" 
                className={brandDarkBlue} 
                // Lock button if pending OR if already submitted without changing input
                disabled={validateMutation.isPending || isSubmitted || (!file && !xmlUrl && !filePath)}
            >
              {validateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitted ? 'Validated' : `Validate ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Result Display Section remains the same */}
      {validationResult && (
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-lg border-0">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              {validationResult.is_valid ? 
                <CheckCircle className="w-5 h-5 text-green-600" /> : 
                <XCircle className="w-5 h-5 text-red-600" />
              }
              <span className={validationResult.is_valid ? 'text-green-900 font-semibold' : 'text-red-900 font-semibold'}>
                Validation Results
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
                <p className={`text-sm font-bold mt-1 ${validationResult.is_valid ? 'text-green-600' : 'text-red-600'}`}>
                  {validationResult.is_valid ? 'Valid' : 'Failed'}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase">Execution Time</p>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {validationResult.execution_time != null && !isNaN(validationResult.execution_time)
                    ? `${(validationResult.execution_time * 1000).toFixed(0)}ms`
                    : 'N/A'}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase">Type</p>
                <p className="text-sm font-bold text-slate-900 mt-1">{validationResult.file_type || 'XML'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase">Source</p>
                <p className="text-sm font-bold text-slate-900 mt-1 truncate" title={validationResult.file_name}>
                  {validationResult.file_name}
                </p>
              </div>
            </div>

            {!validationResult.is_valid && validationResult.error_msg && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-md p-4">
                <p className="font-semibold text-red-900 mb-2">Error Details:</p>
                <div className="bg-white rounded p-3 border border-red-200">
                  <p className="text-sm text-red-800 font-mono whitespace-pre-wrap">{validationResult.error_msg}</p>
                </div>
              </div>
            )}

            {validationResult.is_valid && (
              <div className="bg-green-50 border-l-4 border-green-500 rounded-md p-4">
                <p className="font-semibold text-green-900">✓ XML file is valid and well-formed</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Result:</p>
              <div className="bg-slate-100 rounded-lg p-4 border border-slate-300 overflow-x-auto">
                <pre className="text-xs text-slate-800 font-mono">
                  {JSON.stringify(validationResult, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}