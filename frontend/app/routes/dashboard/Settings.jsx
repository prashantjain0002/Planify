import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Loader2, Palette, SendToBack, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import {
  useUpdateWorkspaceMutation,
  useGetWorkspaceDetailsQuery,
  useDeleteWorkspaceMutation,
  useTransferWorkspaceMutation,
} from "@/hooks/useWorkspace";
import { useWorkspace } from "@/lib/provider/workspaceContext";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import NoDataFound from "@/components/NoDataFound";


export function meta({}) {
  return [
    { title: "Settings - Planify" },
    { name: "description", content: "Workspace Settings - Planify" },
  ];
}

export const colorOptions = [
  "#FF5733",
  "#33C1FF",
  "#28A745",
  "#FFC300",
  "#8E44AD",
  "#E67E22",
  "#2ECC71",
  "#34495E",
];

const WorkspaceSettings = () => {
  const [searchParams] = useSearchParams();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?._id || searchParams.get("workspaceId");
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newOwnerEmail, setNewOwnerEmail] = useState("");

  if (!workspaceId) {
    return (
      <NoDataFound
        title={"No Workspace Selected"}
        description={"Please select or create a workspace to manage settings."}
      />
    );
  }

  const { data: workspace, isPending } =
    useGetWorkspaceDetailsQuery(workspaceId);
  const updateMutation = useUpdateWorkspaceMutation();
  const { mutate: deleteWorkspace, isLoading } = useDeleteWorkspaceMutation();
  const { mutate: transferMutation, isTransferring } =
    useTransferWorkspaceMutation();

  const form = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: workspace?.name || "",
      description: workspace?.description || "",
      color: workspace?.color || colorOptions[0],
    },
    values: workspace,
  });

  const onSubmit = (data) => {
    updateMutation.mutate(
      { workspaceId, data },
      {
        onSuccess: () => {
          toast.success("Workspace updated successfully");
        },
        onError: (err) => {
          const errorMessage =
            err?.response?.data?.message || "something went wrong";
          console.log(err);
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleDelete = () => {
    deleteWorkspace(workspaceId, {
      onSuccess: () => {
        setDeleteOpen(false);
        navigate("/workspaces");
        toast.success("Workspace deleted successfully");
      },
      onError: (err) => {
        const errorMessage = err?.response?.data?.message;
        toast.error(errorMessage);
      },
    });
  };

  const handleTransfer = () => {
    if (!newOwnerEmail) return;

    transferMutation(
      { workspaceId, newOwnerEmail },
      {
        onSuccess: () => {
          toast.success("Workspace transferred successfully!");
          setNewOwnerEmail("");
        },
        onError: (err) => {
          toast.error(
            err?.response?.data?.message || "Failed to transfer workspace"
          );
        },
      }
    );
  };

  return (
    <div className="mx-auto space-y-6">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        size="sm"
        className="p-4 mr-4"
      >
        ← Back
      </Button>

      {/* Workspace Settings */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 rounded-3xl p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isPending ? (
          <div className="flex items-center justify-center h-fit">
            <Loader />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Palette className="h-6 w-6 text-indigo-500" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Workspace Settings
              </h2>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Workspace name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Workspace description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Color Picker */}
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          {colorOptions.map((c) => (
                            <div
                              key={c}
                              className={cn(
                                "w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300",
                                field.value === c &&
                                  "ring-2 ring-offset-2 ring-offset-background ring-blue-500"
                              )}
                              style={{ backgroundColor: c }}
                              onClick={() => field.onChange(c)}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </motion.div>

      {/* Transfer Workspace */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 rounded-3xl p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <SendToBack className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Transfer Workspace
          </h2>
        </div>

        <p className="text-gray-600 dark:text-gray-300">
          Transfer ownership of this workspace to another user. Use with
          caution.
        </p>

        <div className="flex items-center gap-4 mt-4">
          <Input
            placeholder="New Owner's Email"
            value={newOwnerEmail}
            onChange={(e) => setNewOwnerEmail(e.target.value)}
          />
          <Button
            onClick={handleTransfer}
            disabled={isTransferring || !newOwnerEmail}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-md"
          >
            {isTransferring ? "Transferring..." : "Transfer"}
          </Button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 rounded-3xl p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-semibold text-red-600">Danger Zone</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Deleting your workspace is permanent and cannot be undone.
        </p>
        <Button
          variant="destructive"
          className="px-6 py-2"
          onClick={() => setDeleteOpen(true)}
        >
          Delete Workspace
        </Button>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this workspace? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default WorkspaceSettings;
