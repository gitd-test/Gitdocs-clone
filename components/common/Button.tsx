import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg"
}

const Button = ({ children, className, ...props }: ButtonProps) => {


    const variant = props.variant || "default"
    const size = props.size || "default"


  return (
    <button className={`${cn(buttonVariants({ variant, size }), className)} border border-white w-2/3 mx-auto text-white text-md`} {...props}>
      {children}
    </button>
  )




}

export default Button