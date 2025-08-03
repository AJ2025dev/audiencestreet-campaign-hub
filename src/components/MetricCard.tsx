import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon?: React.ReactNode
}

export function MetricCard({ title, value, change, changeType = "neutral", icon }: MetricCardProps) {
  const getTrendIcon = () => {
    if (changeType === "positive") return <TrendingUp className="h-4 w-4 text-success" />
    if (changeType === "negative") return <TrendingDown className="h-4 w-4 text-destructive" />
    return null
  }

  const getChangeColor = () => {
    if (changeType === "positive") return "text-success"
    if (changeType === "negative") return "text-destructive"
    return "text-muted-foreground"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className={`flex items-center gap-1 text-xs ${getChangeColor()}`}>
            {getTrendIcon()}
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  )
}