'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "text-brand-brown-500",
  actionUrl,
  actionLabel,
  actionVariant = "outline"
}) {
  return (
    <Card className="bg-card border border-border shadow-minimalist hover:shadow-minimalist-hover transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className={`${color} text-base font-semibold`}>{title}</CardTitle>
        {icon && <div className={`${color} h-5 w-5`}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-brand-brown-600">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground pt-1">{subtitle}</p>
        )}
      </CardContent>
      {actionUrl && actionLabel && (
        <CardFooter className="pt-0">
          <Link href={actionUrl} className="w-full">
            <Button
              size="default"
              variant={actionVariant}
              className={`w-full h-10 btn-outline-minimal font-medium`}
            >
              {actionLabel}
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
} 