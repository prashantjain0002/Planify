import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",

        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",

        done: "border-transparent bg-green-500 text-white [a&]:hover:bg-green-500/90 focus-visible:ring-green-500/20 dark:focus-visible:ring-green-500/40 dark:bg-green-500/60",

        inProgress:
          "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-500/90 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-500/40 dark:bg-blue-500/60",

        todo: "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-500/90 focus-visible:ring-gray-500/20 dark:focus-visible:ring-gray-500/40 dark:bg-gray-500/60",

        high: "border-transparent bg-red-500 text-white [a&]:hover:bg-red-500/90 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-500/60",

        medium:
          "border-transparent bg-orange-500 text-white [a&]:hover:bg-orange-500/90 focus-visible:ring-orange-500/20 dark:focus-visible:ring-orange-500/40 dark:bg-orange-500/60",

        low: "border-transparent bg-teal-500 text-white [a&]:hover:bg-teal-500/90 focus-visible:ring-teal-500/20 dark:focus-visible:ring-teal-500/40 dark:bg-teal-500/60",
        archived:
          "border-transparent bg-slate-500 text-white [a&]:hover:bg-slate-500/90 focus-visible:ring-slate-500/20 dark:focus-visible:ring-slate-500/40 dark:bg-slate-500/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
