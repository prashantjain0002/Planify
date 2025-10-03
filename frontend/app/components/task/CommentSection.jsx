import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useAddComment, useCommentByIdQuery } from "@/hooks/useTask";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const CommentSection = ({ taskId }) => {
  const [newComment, setNewComment] = useState("");
  const { mutate, isPending } = useAddComment();
  const { data, isLoading } = useCommentByIdQuery(taskId);

  const comments = data || [];

  const handleCreateComment = () => {
    if (!newComment.trim()) return;
    mutate(
      { taskId, text: newComment },
      {
        onSuccess: () => {
          setNewComment("");
          toast.success("Comment added successfully");
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to add comment");
        },
      }
    );
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Comments</h3>

      <ScrollArea className="h-[300px] mb-4 pr-2 scrollbar-hide">
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground">
            Loading comments...
          </p>
        ) : (
          <AnimatePresence>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-4 items-center mb-3 mr-2 shadow-sm px-3 py-2 rounded-2xl bg-muted/40"
                >
                  <Avatar className="size-8">
                    <AvatarImage src={comment?.author?.profilePicture} />
                    <AvatarFallback>
                      {comment?.author?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">
                        {comment?.author?.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {comment?.createdAt
                          ? formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {comment.text}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p
                key="no-comments"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-semibold text-center"
              >
                No comments yet
              </motion.p>
            )}
          </AnimatePresence>
        )}
      </ScrollArea>

      <Separator className="mb-4" />

      <div className="mb-4">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <Button
            disabled={!newComment.trim() || isPending}
            onClick={handleCreateComment}
            className="transition-all"
          >
            {isPending ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
