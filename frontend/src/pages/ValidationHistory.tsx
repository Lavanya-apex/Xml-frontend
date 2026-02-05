import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { validationAPI } from "@/services/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatDate, formatDuration } from "@/lib/utils";
import {
  Search,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { Validation } from "@/types";

export default function ValidationHistory() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedValidation, setSelectedValidation] =
    useState<Validation | null>(null);

  const primaryGrayClass =
    "bg-zinc-800 hover:bg-zinc-700 text-white transition-colors";

  const { data, isLoading } = useQuery({
    queryKey: ["validations", page, statusFilter],
    queryFn: () =>
      validationAPI.getValidations(page, 20, statusFilter || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: validationAPI.deleteValidation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["validations"] });
      alert("Validation deleted successfully");
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || "Failed to delete validation");
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0;

  const sidebarColorClass =
    "bg-zinc-800 hover:bg-zinc-700 text-white transition-colors";

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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // Reset to page 1 when searching
                }}
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
          <CardTitle>Validations ({data?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : data?.items.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No validations found
            </p>
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
                    {data?.items.map((validation) => (
                      <tr
                        key={validation.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(
                              validation.is_valid ? "success" : "failed",
                            )}

                            {/* 2. Boolean values don't render in React. You must convert to a string */}
                            <span className="capitalize">
                              {validation.is_valid ? "success" : "failed"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize">
                          {validation.file_type}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate">
                          {validation.file_name}
                        </td>
                        <td className="py-3 px-4">
                          {formatDate(validation.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          {validation.execution_time
                            ? formatDuration(validation.execution_time)
                            : "N/A"}
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
                                if (
                                  confirm(
                                    "Are you sure you want to delete this validation?",
                                  )
                                ) {
                                  deleteMutation.mutate(validation.id);
                                }
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
                  Page {page} of {totalPages}
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedValidation(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle>Validation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">
                    {selectedValidation.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">
                    {selectedValidation.validation_type}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p className="font-medium break-all">
                    {selectedValidation.source}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Results:</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  {JSON.stringify(selectedValidation.results, null, 2)}
                </pre>
              </div>

              {selectedValidation.error_details && (
                <div>
                  <p className="text-sm font-medium mb-2 text-destructive">
                    Errors:
                  </p>
                  <pre className="bg-destructive/10 p-4 rounded-md overflow-x-auto text-xs">
                    {JSON.stringify(selectedValidation.error_details, null, 2)}
                  </pre>
                </div>
              )}

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
    </div>
  );
}
