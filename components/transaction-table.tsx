"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FetchIncomeData_db } from "@/types";
import formatDate from "@/utils/format-date";
import { Trash2, PencilLine } from "lucide-react";
import { toast } from "sonner";

export default function TransactionTable({
  data,
  currency,
  totalCount,
  currentPage,
  pageSize = 12,
}: {
  data: FetchIncomeData_db[] | undefined;
  currency: string | undefined;
  totalCount: number;
  currentPage: number;
  pageSize?: number;
}) {
  let index = (currentPage - 1) * pageSize; // table row number
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<FetchIncomeData_db | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = pathname.split("/")[1];

  const totalPages = Math.ceil(totalCount / pageSize);

  function deleteEntry(transaction_id: string) {
    setTransactionToDelete(transaction_id);
    setIsDeleteDialogOpen(true);
  }

  function editEntry(transaction_id: string) {
    router.push(`/${type}/update?transaction_id=${transaction_id}`);
  }

  function handleRowClick(transaction: FetchIncomeData_db) {
    // Only show dialog on mobile devices (screen width < 768px)
    if (window.innerWidth < 768) {
      setSelectedTransaction(transaction);
      setIsDetailDialogOpen(true);
    }
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  function generatePageNumbers() {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  }

  async function confirmDelete() {
    if (!transactionToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/delete-transaction", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId: transactionToDelete }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete transaction");
      }

      toast.success("Transaction deleted successfully");

      // Close dialogs and reset state
      setIsDeleteDialogOpen(false);
      setIsDetailDialogOpen(false);
      setTransactionToDelete(null);
      setSelectedTransaction(null);

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete transaction", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  function cancelDelete() {
    setIsDeleteDialogOpen(false);
    setTransactionToDelete(null);
  }

  return (
    <>
      <div className="bg-white rounded-lg ring-sidebar-ring ring-[0.1px] mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">#</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-right w-[40px]">
                Amount ({currency})
              </TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data?.map((i) => (
                <TableRow
                  key={i.transaction_id}
                  className="md:cursor-default cursor-pointer hover:bg-gray-50 md:hover:bg-transparent transition-colors"
                  onClick={() => handleRowClick(i)}
                >
                  <TableCell className="text-left">{++index}</TableCell>
                  <TableCell>{formatDate(i.transaction_date)}</TableCell>
                  <TableCell className="text-right w-[40px]">
                    {(i.amount_cents / 100).toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden md:block">{type}</TableCell>
                  <TableCell>{i.category}</TableCell>
                  <TableCell className="hidden md:block">
                    {i.description}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex gap-5">
                      {/* Update button */}
                      <Button
                        size={"sm"}
                        variant={"themeLight"}
                        onClick={(e) => {
                          e.stopPropagation();
                          editEntry(i.transaction_id);
                        }}
                      >
                        <PencilLine />
                      </Button>
                      {/* Delete button */}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEntry(i.transaction_id);
                        }}
                        size={"sm"}
                        variant={"destructiveLight"}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableCell colSpan={7}>
                <div className="flex flex-col items-center gap-4 w-full py-12">
                  <h2 className="text-3xl">Oopsie daisy 🥀</h2>
                  <p className="text-lg">No transaction records found</p>
                </div>
              </TableCell>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-white rounded-lg ring-sidebar-ring ring-[0.1px]">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
            results
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {generatePageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page as number);
                      }}
                      className="cursor-pointer bg-white"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Transaction Detail Dialog for Mobile */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            {/* Description required */}
            <DialogDescription> </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Date
                  </div>
                  <div className="text-sm">
                    {formatDate(selectedTransaction.transaction_date)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Amount
                  </div>
                  <div className="text-sm font-semibold">
                    {(selectedTransaction.amount_cents / 100).toFixed(2)}{" "}
                    {currency}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Type
                  </div>
                  <div className="text-sm capitalize">{type}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Category
                  </div>
                  <div className="text-sm">{selectedTransaction.category}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Description
                  </div>
                  <div className="text-sm">
                    {selectedTransaction.description || "No description"}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    editEntry(selectedTransaction.transaction_id);
                  }}
                  className="flex-1"
                  variant="themeLight"
                >
                  <PencilLine className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructiveLight"
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    deleteEntry(selectedTransaction.transaction_id);
                  }}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
