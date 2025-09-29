import { useState } from "react";
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
import { Palette, SendToBack, Trash2 } from "lucide-react";
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
import { useNavigate } from "react-router";

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

const WorkspaceSettingsPage = () => {
  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [description, setDescription] = useState("Describe your workspace...");
  const [color, setColor] = useState("#4F46E5");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      color: colorOptions[0],
      description: "",
    },
  });

  const onSubmit = (data) => {};

  return (
    <div className="mx-auto space-y-6">
      <Button
        onClick={() => navigate(-1)}
        variant={"outline"}
        size={"sm"}
        className={"p-4 mr-4"}
      >
        ← Back
      </Button>
      {/* 1. Workspace Settings */}
      <motion.div
        className="bg-white shadow-lg rounded-3xl p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Palette className="h-6 w-6 text-indigo-500" />
          <h2 className="text-2xl font-semibold">Workspace Settings</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      {colorOptions.map((color) => (
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300",
                            field.value === color &&
                              "ring-2 ring-offset-2 ring-offset-background ring-blue-500"
                          )}
                          key={color}
                          style={{ backgroundColor: color }}
                          onClick={() => field.onChange(color)}
                        ></div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={false}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </motion.div>

      {/* 2. Transfer Workspace */}
      <motion.div
        className="bg-white shadow-lg rounded-3xl p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <SendToBack className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-semibold">Transfer Workspace</h2>
        </div>
        <p className="text-gray-600">
          Transfer ownership of this workspace to another user. Use with
          caution.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <Input placeholder="New Owner's Email" />
          <Button
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-md"
            onClick={() => alert("Transfer request sent!")}
          >
            Transfer
          </Button>
        </div>
      </motion.div>

      {/* 3. Danger Zone */}
      <motion.div
        className="bg-white shadow-lg rounded-3xl p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-semibold text-red-600">Danger Zone</h2>
        </div>
        <p className="text-gray-600">
          Deleting your workspace is permanent and cannot be undone.
        </p>
        <Button
          variant="destructive"
          className="px-6 py-2"
          onClick={() => setDeleteOpen(true)}
        >
          Delete Workspace
        </Button>

        {/* Delete Confirmation Modal */}
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
                onClick={() => alert("Workspace Deleted!")}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default WorkspaceSettingsPage;
