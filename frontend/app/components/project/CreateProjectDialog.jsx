// import { projectSchema, ProjectStatus } from "@/lib/schema";
// import React from "react";
// import { useForm } from "react-hook-form";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../ui/form";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { CalendarIcon, Loader2 } from "lucide-react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Textarea } from "../ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Calendar } from "../ui/calendar";
// import { format } from "date-fns";
// import { Checkbox } from "../ui/checkbox";
// import { useCreateProject } from "@/hooks/useProject";
// import { toast } from "sonner";

// const CreateProjectDialog = ({
//   isOpen,
//   onOpenChange,
//   workspaceId,
//   workspaceMembers,
// }) => {
//   const form = useForm({
//     resolver: zodResolver(projectSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       status: "Planning",
//       startDate: "",
//       dueDate: "",
//       members: [],
//       tags: undefined,
//     },
//   });

//   const { mutate, isPending } = useCreateProject();

//   const onSubmit = (projectData) => {
//     if (!workspaceId) return;

//     mutate(
//       { projectData, workspaceId },
//       {
//         onSuccess: () => {
//           toast.success("Project created successfully");
//           form.reset();
//           onOpenChange(false);
//         },
//         onError: (error) => {
//           const errorMessage =
//             error?.response?.data?.message || "something went wrong";
//           console.log(error);
//           toast.error(errorMessage);
//         },
//       }
//     );
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className={"sm:max-w-[540px]"}>
//         <DialogHeader>
//           <DialogTitle>Create project</DialogTitle>
//           <DialogDescription>
//             Create a new project to get started
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Project Title</FormLabel>
//                   <FormControl>
//                     <Input type="text" placeholder="Project Title" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       rows={4}
//                       placeholder="Project description"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="status"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Project Status</FormLabel>
//                   <FormControl>
//                     <Select value={field.value} onValueChange={field.onChange}>
//                       <SelectTrigger className={"w-full"}>
//                         <SelectValue placeholder="Project Status" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         {Object.values(ProjectStatus).map((status) => (
//                           <SelectItem key={status} value={status}>
//                             {status}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="startDate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Start Date</FormLabel>
//                     <FormControl>
//                       <Popover modal={true} closeOnInteract={false}>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant={"outline"}
//                             className={
//                               "w-full justify-start text-left font-normal" +
//                               (!field.value && " text-muted-foreground")
//                             }
//                           >
//                             <CalendarIcon className={"size-4"} />
//                             {field.value ? (
//                               format(field.value, "PPPP")
//                             ) : (
//                               <span className="text-muted-foreground">
//                                 Pick a date
//                               </span>
//                             )}
//                           </Button>
//                         </PopoverTrigger>

//                         <PopoverContent className={"w-auto p-0"}>
//                           <Calendar
//                             mode="single"
//                             selected={
//                               field.value ? new Date(field.value) : null
//                             }
//                             onSelect={(date) => {
//                               field.onChange(date?.toISOString() || null);
//                             }}
//                             initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="dueDate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Due Date</FormLabel>
//                     <FormControl>
//                       <Popover modal={true} closeOnInteract={false}>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant={"outline"}
//                             className={
//                               "w-full justify-start text-left font-normal" +
//                               (!field.value && " text-muted-foreground")
//                             }
//                           >
//                             <CalendarIcon className={"size-4"} />
//                             {field.value ? (
//                               format(field.value, "PPPP")
//                             ) : (
//                               <span className="text-muted-foreground">
//                                 Pick a date
//                               </span>
//                             )}
//                           </Button>
//                         </PopoverTrigger>

//                         <PopoverContent className={"w-auto p-0"}>
//                           <Calendar
//                             mode="single"
//                             selected={
//                               field.value ? new Date(field.value) : null
//                             }
//                             onSelect={(date) => {
//                               field.onChange(date?.toISOString() || null);
//                             }}
//                             initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="tags"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Tags</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="text"
//                       placeholder="Tags seprated by comma"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="members"
//               render={({ field }) => {
//                 const selectedMembers = field.value || [];

//                 return (
//                   <FormItem>
//                     <FormLabel>Members</FormLabel>
//                     <FormControl>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             className="w-full justify-start text-left font-normal min-h-11"
//                             variant="outline"
//                           >
//                             {selectedMembers.length === 0 ? (
//                               <span className="text-muted-foreground">
//                                 Select Members
//                               </span>
//                             ) : selectedMembers.length <= 2 ? (
//                               selectedMembers.map((m) => {
//                                 const member = workspaceMembers.find(
//                                   (wm) => wm.user._id === m.user
//                                 );
//                                 return (
//                                   <span key={m.user}>
//                                     {member?.user.name} ({m.role})
//                                   </span>
//                                 );
//                               })
//                             ) : (
//                               `${selectedMembers.length} members selected`
//                             )}
//                           </Button>
//                         </PopoverTrigger>

//                         <PopoverContent
//                           className="w-sm max-w-60 overflow-y-auto"
//                           align="start"
//                         >
//                           <div className="flex flex-col gap-2">
//                             {workspaceMembers.map((member) => {
//                               const selectedMember = selectedMembers.find(
//                                 (m) => m.user === member.user._id
//                               );

//                               return (
//                                 <div
//                                   key={member._id}
//                                   className="flex items-center gap-2 p-2 border rounded"
//                                 >
//                                   <Checkbox
//                                     checked={!!selectedMember}
//                                     onCheckedChange={(checked) => {
//                                       if (checked) {
//                                         field.onChange([
//                                           ...selectedMembers,
//                                           {
//                                             user: member.user._id,
//                                             role: "contributor",
//                                           },
//                                         ]);
//                                       } else {
//                                         field.onChange(
//                                           selectedMembers.filter(
//                                             (m) => m.user !== member.user._id
//                                           )
//                                         );
//                                       }
//                                     }}
//                                     id={`member-${member.user._id}`}
//                                   />

//                                   <span className="flex-1 truncate">
//                                     {member.user.name}
//                                   </span>

//                                   {selectedMember && (
//                                     <Select
//                                       value={selectedMember.role}
//                                       onValueChange={(role) => {
//                                         field.onChange(
//                                           selectedMembers.map((m) =>
//                                             m.user === member.user._id
//                                               ? { ...m, role }
//                                               : m
//                                           )
//                                         );
//                                       }}
//                                     >
//                                       <SelectTrigger className="w-28">
//                                         <SelectValue placeholder="Select Role" />
//                                       </SelectTrigger>
//                                       <SelectContent>
//                                         <SelectItem value="manager">
//                                           Manager
//                                         </SelectItem>
//                                         <SelectItem value="contributor">
//                                           Contributor
//                                         </SelectItem>
//                                         <SelectItem value="viewer">
//                                           Viewer
//                                         </SelectItem>
//                                       </SelectContent>
//                                     </Select>
//                                   )}
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </PopoverContent>
//                       </Popover>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 );
//               }}
//             />

//             <DialogFooter>
//               <Button type="submit" disabled={isPending}>
//                 {isPending ? (
//                   <Loader2 className="w-4 h-4 mr-2" />
//                 ) : (
//                   "Create Project"
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateProjectDialog;

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectStatus } from "@/lib/schema";
import { useCreateProject } from "@/hooks/useProject";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
// import WorkspaceAvatar from "./WorkspaceAvatar";
import { format } from "date-fns";

const CreateProjectDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
  workspaceMembers,
}) => {
  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: ProjectStatus.Planning,
      startDate: null,
      dueDate: null,
      members: [],
      tags: "",
    },
  });

  const { mutate, isPending } = useCreateProject();

  const onSubmit = (data) => {
    if (!workspaceId) return;

    mutate(
      { projectData: data, workspaceId },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
          form.reset();
          onOpenChange(false);
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
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a new project to get started
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Project Name */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ProjectStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              {["startDate", "dueDate"].map((dateField) => (
                <FormField
                  key={dateField}
                  control={form.control}
                  name={dateField}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {dateField === "startDate" ? "Start Date" : "Due Date"}
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              <CalendarIcon className="size-4 mr-2" />
                              {field.value
                                ? format(new Date(field.value), "PPP")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-auto">
                            <Calendar
                              mode="single"
                              selected={field.value ?? null}
                              onSelect={(date) => {
                                field.onChange(date);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Members */}
            <FormField
              control={form.control}
              name="members"
              render={({ field }) => {
                const selectedMembers = field.value || [];

                return (
                  <FormItem>
                    <FormLabel>Members</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className="w-full justify-start text-left font-normal min-h-11"
                            variant="outline"
                          >
                            {selectedMembers.length === 0
                              ? "Select members"
                              : selectedMembers.length <= 2
                                ? selectedMembers.map((m) => {
                                    const mem = workspaceMembers.find(
                                      (wm) => wm.user._id === m.user
                                    );
                                    return (
                                      <span key={m.user}>
                                        {mem?.user.name} ({m.role})
                                      </span>
                                    );
                                  })
                                : `${selectedMembers.length} members selected`}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent
                          className="w-sm max-w-60 overflow-y-auto"
                          align="start"
                        >
                          <div className="flex flex-col gap-2">
                            {workspaceMembers.map((member) => {
                              const isSelected = selectedMembers.find(
                                (m) => m.user === member.user._id
                              );
                              return (
                                <div
                                  key={member._id}
                                  className="flex items-center gap-2 p-2 border rounded"
                                >
                                  <Checkbox
                                    checked={!!isSelected}
                                    onCheckedChange={(checked) => {
                                      const newMembers = checked
                                        ? [
                                            ...selectedMembers,
                                            {
                                              user: member.user._id,
                                              role: "contributor",
                                            },
                                          ]
                                        : selectedMembers.filter(
                                            (m) => m.user !== member.user._id
                                          );
                                      field.onChange(newMembers);
                                    }}
                                    id={`member-${member.user._id}`}
                                  />
                                  <span className="flex-1 truncate">
                                    {member.user.name}
                                  </span>

                                  {isSelected && (
                                    <Select
                                      value={isSelected.role}
                                      onValueChange={(role) => {
                                        const updated = selectedMembers.map(
                                          (m) =>
                                            m.user === member.user._id
                                              ? { ...m, role }
                                              : m
                                        );
                                        field.onChange(updated);
                                      }}
                                    >
                                      <SelectTrigger className="w-28">
                                        <SelectValue placeholder="Select Role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="manager">
                                          Manager
                                        </SelectItem>
                                        <SelectItem value="contributor">
                                          Contributor
                                        </SelectItem>
                                        <SelectItem value="viewer">
                                          Viewer
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Tags separated by comma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2" />
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
