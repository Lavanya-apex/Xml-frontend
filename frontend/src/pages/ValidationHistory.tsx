import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { validationAPI } from '@/services/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { formatDate, formatDuration } from '@/lib/utils'
import { Search, Trash2, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import type { Validation } from '@/types'

export default function ValidationHistory() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedValidation, setSelectedValidation] = useState<Validation | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const primaryGrayClass = "bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
  

  const { data, isLoading } = useQuery({
    queryKey: ['validations', page, statusFilter, searchTerm],
    queryFn: () => validationAPI.getValidations(page),
  })

  const deleteMutation = useMutation({
    mutationFn: validationAPI.deleteValidation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations'] })
      setSuccessMessage('Validation deleted successfully')
      setDeleteConfirm(null)
      setTimeout(() => setSuccessMessage(null), 3000)
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || 'Failed to delete validation')
    },
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  // Client-side pagination setup (backend currently returns full list)
  const pageSize = 20
  const validationsList = Array.isArray(data) ? data : []

  // Filter by status and search term on the client so the search box works
  const filteredValidations = validationsList.filter((v: Validation) => {
    const matchesStatus = statusFilter ? (statusFilter === 'success' ? v.is_valid : !v.is_valid) : true
    const matchesSearch = searchTerm
      ? (v.file_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      : true
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filteredValidations.length / pageSize))
  const pagedValidations = filteredValidations.slice((page - 1) * pageSize, page * pageSize)
 
  const sidebarColorClass = "bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Validation History</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by source..."
                className="w-full"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Validations ({filteredValidations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : !Array.isArray(data) || data.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No validations found</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Source</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Time</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                      {pagedValidations && pagedValidations.map((validation) => (
                      <tr key={validation.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(validation.is_valid ? 'success' : 'failed')}
                            <span className="capitalize">{validation.is_valid ? 'success' : 'failed'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize">{validation.file_type}</td>
                        <td className="py-3 px-4 max-w-xs truncate">{validation.file_name}</td>
                        <td className="py-3 px-4">{validation.validated_date ? new Date(validation.validated_date).toLocaleDateString() : 'N/A'}</td>
                        <td className="py-3 px-4">
                          {validation.execution_time
                            ? (validation.execution_time * 1000).toFixed(0) + 'ms'
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedValidation(validation)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setDeleteConfirm(validation.id)
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                  Showing {filteredValidations.length} validations
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      {selectedValidation && (
        <div
          key={`modal-${selectedValidation.id}`}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedValidation(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(selectedValidation.is_valid ? 'success' : 'failed')}
                Validation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className={`font-medium capitalize ${selectedValidation.is_valid ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedValidation.is_valid ? 'Valid' : 'Invalid'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{selectedValidation.file_type || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Source File</p>
                  <p className="font-medium break-all">{selectedValidation.file_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Validation Date</p>
                  <p className="font-medium">{selectedValidation.validated_date ? new Date(selectedValidation.validated_date).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Execution Time</p>
                  <p className="font-medium">{selectedValidation.execution_time && selectedValidation.execution_time > 0 ? (selectedValidation.execution_time * 1000).toFixed(0) + 'ms' : 'N/A'}</p>
                </div>
              </div>

              {!selectedValidation.is_valid && selectedValidation.error_msg && selectedValidation.error_msg !== 'None' ? (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-md p-4 mt-4">
                  <p className="text-sm font-semibold text-red-900 mb-2">Reason for Failure:</p>
                  <pre className="bg-white rounded p-3 border border-red-200 text-xs text-red-800 font-mono whitespace-pre-wrap">
                    {selectedValidation.error_msg}
                  </pre>
                </div>
              ) : selectedValidation.is_valid ? (
                <div className="bg-green-50 border-l-4 border-green-500 rounded-md p-4 mt-4">
                  <p className="text-sm font-semibold text-green-900">✓ XML file is valid and well-formed</p>
                </div>
              ) : null}

              <Button 
                onClick={() => setSelectedValidation(null)} 
                className={`w-full py-6 text-base font-semibold ${primaryGrayClass}`}
              >
                Close Details
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="w-6 h-6" />
                Delete Validation?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This action cannot be undone. Are you sure you want to permanently delete this validation record?
              </p>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteMutation.mutate(deleteConfirm)}
                  disabled={deleteMutation.isPending}
                  className="px-6 bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <Card className="bg-green-50 border border-green-200 shadow-lg">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="font-medium text-green-900">{successMessage}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
