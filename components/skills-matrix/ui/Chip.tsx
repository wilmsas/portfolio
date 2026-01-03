/**
 * Chip Component
 *
 * Small badge/tag component for displaying categorical information
 * Now using shadcn/ui Badge component
 */

import { Badge } from "@/components/ui/badge";

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="outline" className="gap-2 text-xs">
      {children}
    </Badge>
  );
}
