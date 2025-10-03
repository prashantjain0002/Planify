import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateWorkspaceMutation } from "@/hooks/useWorkspace";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useWorkspace } from "@/lib/provider/workspaceContext"; // ✅ Import context

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

const CreateWorkspace = ({ isCreatingWorkspace, setIsCreatingWorkspace }) => {
  const { setSelectedWorkspace } = useWorkspace();
  const form = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      color: colorOptions[0],
      description: "",
    },
  });

  const { mutate, isPending } = useCreateWorkspaceMutation();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: (workspace) => {
        form.reset();
        setSelectedWorkspace(workspace);
        setIsCreatingWorkspace(false);
        toast.success("Workspace created successfully");
        navigate(`/workspaces/${workspace._id}`);
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message;
        toast.error(errorMessage || "Failed to create workspace");
      },
    });
  };

  return (
    <Dialog
      open={isCreatingWorkspace}
      onOpenChange={setIsCreatingWorkspace}
      modal
    >
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>

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
                          key={color}
                          style={{ backgroundColor: color }}
                          className={cn(
                            "w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300",
                            field.value === color &&
                              "ring-2 ring-offset-2 ring-offset-background ring-blue-500"
                          )}
                          onClick={() => field.onChange(color)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 mr-2" /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspace;
