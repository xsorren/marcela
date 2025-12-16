import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:mx-auto [&_svg]:my-auto [&_svg]:block [&_span]:block [&_span]:mx-auto [&_span]:my-auto",
  {
    variants: {
      variant: {
        default: "bg-brand-brown-500 text-white hover:bg-brand-brown-600 shadow-soft hover:shadow-card hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-minimalist-hover",
        outline:
          "border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-brand-brown-400 text-neutral-700 hover:text-brand-brown-600 shadow-soft hover:shadow-minimalist",
        secondary:
          "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 shadow-soft hover:shadow-minimalist",
        ghost: "hover:bg-neutral-100 hover:text-brand-brown-600 transition-colors duration-200",
        link: "text-brand-brown-600 underline-offset-4 hover:underline hover:text-brand-brown-700",
        success: "bg-brand-green-500 text-white hover:bg-brand-green-600 shadow-soft hover:shadow-glow-green hover:scale-[1.02] active:scale-[0.98]",
        premium: "bg-gradient-to-r from-[#8A2F4C] to-[#606648] hover:from-[#7A2942] hover:to-[#565A40] text-white font-semibold shadow-glow transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-card-hover",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8",
        icon: "h-10 w-10 p-2.5",
        "icon-sm": "h-9 w-9 p-2",
        "icon-lg": "h-12 w-12 p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
