import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        "rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-8 sm:h-10 px-4 sm:px-5 sm:w-auto cursor-pointer disabled:opacity-50 disabled:cursor-default",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
