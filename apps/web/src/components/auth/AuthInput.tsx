import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          "h-11 rounded-lg border-primary/20 bg-white/80 px-4 py-3 text-base transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-accent/30",
          className
        )}
        {...props}
      />
    );
  }
);
AuthInput.displayName = "AuthInput";

export { AuthInput };
