import { AlertCircle, ArchiveX } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

interface MessageBoxProps {
  title: string
  message: string
  type?: "info" | "error"
  className?: string
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  title,
  message,
  type = "info",
  className,
}) => (
  <Alert
    variant={type === "error" ? "destructive" : "default"}
    className={`max-w-[400px] mx-auto my-5 ${className}`}
  >
    {type === "error" ? (
      <AlertCircle className="h-4 w-4" />
    ) : (
      <ArchiveX className="h-4 w-4" />
    )}
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
)
