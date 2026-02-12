import React, { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { xsdAPI } from '@/services/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface XSDFile {
  id: number
  name: string
  filename?: string
  created_at?: string
}

// Custom Input Component
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

export default function ValidateWithXSD() {
  const queryClient = useQueryClient()

  // State Management
  const [xmlFile, setXmlFile] = useState<File | null>(null)
  const [xsdFile, setXsdFile] = useState<File | null>(null)
  const [selectedXsdId, setSelectedXsdId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'validate-xsd' | 'validate-xml'>('validate-xsd')
  const [validationResult, setValidationResult] = useState<any>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [inputFormat, setInputFormat] = useState<'xml' | 'json' | 'yaml'>('xml')
  const [outputFormat, setOutputFormat] = useState<'xml' | 'json' | 'yaml'>('xml')

  const brandDarkBlue = "w-full py-2 px-4 rounded bg-[#2D3748] hover:bg-[#1a202c] text-white font-medium transition-all disabled:opacity-50 flex justify-center items-center gap-2"

  // Fetch existing XSD files for validation
  const { data: xsdFiles = [], isLoading: xsdLoading } = useQuery({
    queryKey: ['xsd-files'],
    queryFn: xsdAPI.getAllXSD,
    refetchOnMount: true,
  })

  const refreshAppData = () => {
    queryClient.invalidateQueries({ queryKey: ['xsd-files'] })
    queryClient.invalidateQueries({ queryKey: ['validations'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
  }

  // Upload and validate XSD file (schema only)
  const uploadXsdMutation = useMutation({
    mutationFn: ({ xsdFile }: { xsdFile: File }) => {
      return xsdAPI.uploadXSD(xsdFile)
    },
    onSuccess: (data) => {
      setValidationResult(data)
      setIsSubmitted(true)
      setXsdFile(null)
      refreshAppData()
    },
    onError: (error: any) => {
      setValidationResult({
        status: 'failed',
        error_details: {
          message: error.response?.data?.detail || 'XSD validation failed',
        },
      })
      setIsSubmitted(true)
    },
  })

  // Validate XML against existing XSD
  const validateXmlMutation = useMutation({
    mutationFn: ({ xmlFile, xsdId }: { xmlFile: File; xsdId: number }) => {
      return xsdAPI.validateXMLWithXSD(xmlFile, xsdId, inputFormat, outputFormat)
    },
    onSuccess: (data) => {
      setValidationResult(data)
      setIsSubmitted(true)
      refreshAppData()
    },
    onError: (error: any) => {
      setValidationResult({
        status: 'failed',
        error_details: {
          message: error.response?.data?.detail || 'XML validation failed',
        },
      })
      setIsSubmitted(true)
    },
  })

  // Handlers
  const handleValidateXsd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!xsdFile) {
      alert('Please select an XSD file')
      return
    }
    uploadXsdMutation.mutate({ xsdFile })
  }

  const handleValidateXml = (e: React.FormEvent) => {
    e.preventDefault()
    if (!xmlFile) {
      alert('Please select an XML file')
      return
    }
    if (!selectedXsdId) {
      alert('Please select an XSD schema')
      return
    }
    validateXmlMutation.mutate({ xmlFile, xsdId: selectedXsdId })
  }

  const onInputChange = () => {
    if (isSubmitted) {
      setIsSubmitted(false)
      setValidationResult(null)
    }
  }

  // Render validation status icon
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-600" />
      default:
        return <AlertCircle className="h-6 w-6 text-yellow-600" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Validate XML with XSD</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-6 border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('validate-xsd')
            setValidationResult(null)
            setIsSubmitted(false)
          }}
          className={`pb-3 px-2 transition-colors font-medium ${
            activeTab === 'validate-xsd'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Validate XSD
        </button>
        <button
          onClick={() => {
            setActiveTab('validate-xml')
            setValidationResult(null)
            setIsSubmitted(false)
          }}
          className={`pb-3 px-2 transition-colors font-medium ${
            activeTab === 'validate-xml'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Validate XML
        </button>
      </div>

      {/* Validate XSD Tab */}
      {activeTab === 'validate-xsd' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Validate XSD Schema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleValidateXsd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select XSD File
                </label>
                <CustomInput
                  type="file"
                  accept=".xsd"
                  onChange={(e) => {
                    setXsdFile(e.target.files?.[0] || null)
                    onInputChange()
                  }}
                />
                {xsdFile && <p className="text-sm text-green-600 mt-1">✓ {xsdFile.name}</p>}
              </div>

              <button
                type="submit"
                disabled={!xsdFile || uploadXsdMutation.isPending}
                className={brandDarkBlue}
              >
                {uploadXsdMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validating XSD...
                  </>
                ) : (
                  'Validate XSD'
                )}
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Validate XML Tab */}
      {activeTab === 'validate-xml' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Validate XML against XSD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleValidateXml} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select XSD Schema
                </label>
                <select
                  value={selectedXsdId || ''}
                  onChange={(e) => {
                    setSelectedXsdId(e.target.value ? parseInt(e.target.value) : null)
                    onInputChange()
                  }}
                  disabled={xsdLoading}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:opacity-50"
                >
                  <option value="">Choose an XSD...</option>
                  {xsdFiles.map((xsd: XSDFile) => (
                    <option key={xsd.id} value={xsd.id}>
                      {xsd.name}
                    </option>
                  ))}
                </select>
                {selectedXsdId && (
                  <p className="text-sm text-green-600 mt-1">✓ XSD selected</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select XML File
                </label>
                <CustomInput
                  type="file"
                  accept=".xml,.json,.yaml,.yml"
                  onChange={(e) => {
                    setXmlFile(e.target.files?.[0] || null)
                    onInputChange()
                  }}
                />
                {xmlFile && <p className="text-sm text-green-600 mt-1">✓ {xmlFile.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Input Format
                  </label>
                  <select
                    value={inputFormat}
                    onChange={(e) => {
                      setInputFormat(e.target.value as 'xml' | 'json' | 'yaml')
                      onInputChange()
                    }}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                  >
                    <option value="xml">XML</option>
                    <option value="json">JSON</option>
                    <option value="yaml">YAML</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Output Format
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => {
                      setOutputFormat(e.target.value as 'xml' | 'json' | 'yaml')
                      onInputChange()
                    }}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                  >
                    <option value="xml">XML</option>
                    <option value="json">JSON</option>
                    <option value="yaml">YAML</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!xmlFile || !selectedXsdId || validateXmlMutation.isPending}
                className={brandDarkBlue}
              >
                {validateXmlMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validating XML...
                  </>
                ) : (
                  'Validate XML'
                )}
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {renderStatusIcon(validationResult.status)}
              {validationResult.status === 'success' ? 'Validation Successful' : 'Validation Failed'}
            </CardTitle>
            <div className="mt-4 space-y-1 text-sm text-slate-600">
              {activeTab === 'validate-xsd' ? (
                <p><span className="font-medium">XSD File:</span> {xsdFile?.name || 'Unknown'}</p>
              ) : (
                <>
                  <p><span className="font-medium">XSD Schema:</span> {xsdFiles.find(x => x.id === selectedXsdId)?.name || 'Unknown'}</p>
                  <p><span className="font-medium">XML File:</span> {xmlFile?.name || 'Unknown'}</p>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {validationResult.status === 'success' ? (
              <div className="space-y-2">
                {activeTab === 'validate-xsd' ? (
                  <p className="text-green-700 font-medium">✓ XSD schema is valid</p>
                ) : (
                  <p className="text-green-700 font-medium">✓ XML is valid according to the XSD schema</p>
                )}
                {validationResult.execution_time && (
                  <p className="text-sm text-slate-600">
                    Execution time: {(validationResult.execution_time / 1000).toFixed(2)}s
                  </p>
                )}
                {activeTab === 'validate-xml' && (validationResult.input_format || validationResult.output_format) && (
                  <p className="text-sm text-slate-600">
                    Input Format: <span className="font-medium">{validationResult.input_format || 'xml'}</span> → 
                    Output Format: <span className="font-medium">{validationResult.output_format || 'xml'}</span>
                  </p>
                )}
                {activeTab === 'validate-xml' && validationResult.validated_content && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-md border border-slate-200">
                    <p className="font-medium text-slate-900 mb-2">Validated Content ({validationResult.output_format || 'xml'}):</p>
                    <pre className="text-xs text-slate-700 overflow-auto max-h-64 whitespace-pre-wrap break-words">
                      {validationResult.validated_content}
                    </pre>
                  </div>
                )}
                {validationResult.results && Object.keys(validationResult.results).length > 0 && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-md border border-slate-200">
                    <p className="font-medium text-slate-900 mb-2">Validation Details:</p>
                    <pre className="text-xs text-slate-700 overflow-auto max-h-64">
                      {JSON.stringify(validationResult.results, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {activeTab === 'validate-xsd' ? (
                  <p className="text-red-700 font-medium">✗ XSD schema validation failed</p>
                ) : (
                  <p className="text-red-700 font-medium">✗ XML validation failed</p>
                )}
                {validationResult.error_details && (
                  <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200">
                    <p className="font-medium text-red-900 mb-2">Error Details:</p>
                    <pre className="text-xs text-red-700 overflow-auto max-h-64">
                      {JSON.stringify(validationResult.error_details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
