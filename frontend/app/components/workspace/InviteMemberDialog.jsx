import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteMemberSchema } from "@/lib/schema";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, Loader, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { useInviteMemberMutation } from "@/hooks/useWorkspace";
import { toast } from "sonner";

export const ROLES = ["member", "admin", "viewer"];

const InviteMemberDialog = ({ isOpen, onOpenChange, workspaceId }) => {
  const [inviteTab, setInviteTab] = useState("email");
  const [linkCopied, setLinkCopied] = useState("email");

  const form = useForm({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const { mutate, isPending } = useInviteMemberMutation();

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/workspace-invite/${workspaceId}`
    );
    setLinkCopied(true);

    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  const onSubmit = async (data) => {
    if (!workspaceId) return;

    mutate(
      { workspaceId, ...data },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
          setInviteTab("email");
          toast.success("Member invitation sent successfully");
        },
        onError: (err) => {
          const errorMessage =
            err?.response?.data?.message || "Something went wrong";
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium text-lg">
            Invite to Workspace
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="email"
          value={inviteTab}
          onValueChange={setInviteTab}
        >
          <TabsList>
            <TabsTrigger value="email" disabled={isPending}>
              Send Email
            </TabsTrigger>
            <TabsTrigger value="link" disabled={isPending}>
              Share Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <div className="grid gap-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="member@example.com"
                            className="rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Select Role
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-3 flex-wrap">
                            {ROLES.map((role) => (
                              <button
                                type="button"
                                key={role}
                                onClick={() => field.onChange(role)}
                                className={`px-4 py-2 rounded-lg border transition-all text-sm capitalize
                                    
                            ${
                              field.value === role
                                ? "bg-green-500 text-white border-green-500 shadow-md"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                            }`}
                                disabled={isPending}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="mt-4">
                    <Button
                      type="submit"
                      className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isPending}
                    >
                      {isPending && <Loader className="mr-2 animate-spin" />}
                      Send Invitation
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="link">
            <div className="grid gap-1">
              <Label className={"mt-2"}>Share this link to invite people</Label>
              <div className="flex items-center gap-3">
                <Input
                  readOnly
                  value={`${window.location.origin}/workspace-invite/${workspaceId}`}
                  className="rounded-lg bg-gray-50 dark:bg-gray-800 font-mono text-sm"
                />
                <Button
                  onClick={handleCopyInviteLink}
                  className={`flex items-center gap-2 rounded-lg transition-colors ${
                    linkCopied
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={isPending}
                >
                  {linkCopied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
