import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const MAGNETIC_DISTANCE = 5; // Max pixels button can move

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground",
        secondary: "bg-gradient-secondary text-secondary-foreground hover:opacity-90 shadow-soft hover:shadow-lg",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        soft: "bg-muted text-foreground hover:bg-muted/80",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const [magneticStyle, setMagneticStyle] = React.useState({});
    const [spotlightStyle, setSpotlightStyle] = React.useState({});
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const isMagnetic = variant !== "destructive" && !props.disabled;

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isMagnetic || window.innerWidth < 768) return;
      
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = Math.max(rect.width, rect.height) / 2;
      const factor = Math.min(distance / maxDistance, 1);

      const translateX = (x / maxDistance) * MAGNETIC_DISTANCE * (1 - factor);
      const translateY = (y / maxDistance) * MAGNETIC_DISTANCE * (1 - factor);

      setMagneticStyle({
        transform: `translate(${translateX}px, ${translateY}px)`,
      });

      setSpotlightStyle({
        background: `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.15), transparent 60%)`,
      });
    };

    const handleMouseLeave = () => {
      setMagneticStyle({});
      setSpotlightStyle({});
    };

    React.useImperativeHandle(ref, () => buttonRef.current!);

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={buttonRef}
        style={magneticStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {isMagnetic && <span className="absolute inset-0 pointer-events-none transition-all duration-150" style={spotlightStyle} />}
        {props.children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
