import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'working' | 'partial' | 'missing' | 'pending';
  text: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'working':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          className: 'bg-success/10 text-success border-success/20',
          prefix: '✅'
        };
      case 'partial':
        return {
          icon: <AlertTriangle className="h-3 w-3" />,
          className: 'bg-warning/10 text-warning border-warning/20',
          prefix: '⚠️'
        };
      case 'missing':
        return {
          icon: <XCircle className="h-3 w-3" />,
          className: 'bg-destructive/10 text-destructive border-destructive/20',
          prefix: '❌'
        };
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          className: 'bg-muted/10 text-muted-foreground border-muted/20',
          prefix: '⏳'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={`gap-1 ${config.className}`}>
      {config.icon}
      {config.prefix} {text}
    </Badge>
  );
};

export default StatusBadge;