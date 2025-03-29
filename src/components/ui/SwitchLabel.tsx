"use client";

import * as React from "react";
import { Switch } from "./Switch"; // Importe le Switch existant
import { cn } from "@/lib/utils/utils";

interface SwitchLabelProps extends React.ComponentPropsWithoutRef<typeof Switch> {
  label?: string;
  description?: string;
  className?: string;
}

export function SwitchLabel({
  label,
  description,
  className,
  ...props
}: SwitchLabelProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Switch {...props} />
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-medium">{label}</span>}
          {description && <span className="text-xs text-gray-500">{description}</span>}
        </div>
      )}
    </div>
  );
}