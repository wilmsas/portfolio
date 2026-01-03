/**
 * CardShell Component
 *
 * Reusable card container with title, optional subtitle, and optional right-side content
 * Now using shadcn/ui Card components
 */

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card";

interface CardShellProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}

export function CardShell({ title, subtitle, right, children }: CardShellProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
        {right && <CardAction>{right}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
