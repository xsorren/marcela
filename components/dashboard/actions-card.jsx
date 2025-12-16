'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ActionsCard({
  title,
  description,
  actions = []
}) {
  return (
    <Card className="bg-card border border-border shadow-minimalist hover:shadow-minimalist-hover transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-foreground font-semibold">{title}</CardTitle>
        {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Link href={action.href} key={index} className="w-full block">
            <Button
              className={action.primary
                ? "w-full h-12 btn-primary-minimal flex items-center justify-center gap-2 font-medium"
                : "w-full h-12 btn-outline-minimal font-medium"}
              variant={action.primary ? "default" : "outline"}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
} 