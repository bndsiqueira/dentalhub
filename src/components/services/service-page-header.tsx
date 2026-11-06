"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "./service-form";

export function ServicePageHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Serviços</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie o catálogo de serviços da clínica
        </p>
      </div>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Novo serviço
      </Button>
      <ServiceForm open={open} onOpenChange={setOpen} />
    </div>
  );
}
