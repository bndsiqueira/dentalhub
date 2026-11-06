"use client";

import { useState, useTransition } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { deleteService } from "@/actions/services";
import { ServiceForm, type ServiceData } from "./service-form";

interface ServiceTableProps {
  services: ServiceData[];
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function CategoryBadge({ category }: { category: string }) {
  const variantMap: Record<string, "default" | "secondary" | "outline"> = {
    Prevenção: "secondary",
    Tratamento: "default",
    Estético: "outline",
    Cirúrgico: "destructive" as "default",
  };
  return (
    <Badge variant={variantMap[category] ?? "secondary"}>{category}</Badge>
  );
}

function ServiceRow({ service }: { service: ServiceData }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteService(service.id);
      setDeleteOpen(false);
    });
  }

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-2">
            <span
              className="inline-block size-3 rounded-full shrink-0"
              style={{ backgroundColor: service.color }}
            />
            <span className="font-medium">{service.name}</span>
          </div>
        </TableCell>
        <TableCell>
          <CategoryBadge category={service.category} />
        </TableCell>
        <TableCell>{formatPrice(service.price)}</TableCell>
        <TableCell>{service.durationMinutes} min</TableCell>
        <TableCell>{service.defaultSessions}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="size-8" />
              }
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Abrir menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <ServiceForm
        service={service}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir serviço</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir{" "}
            <span className="font-medium text-foreground">{service.name}</span>?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ServiceTable({ services }: ServiceTableProps) {
  if (services.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Nenhum serviço cadastrado. Clique em &quot;Novo serviço&quot; para
        começar.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Serviço</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Duração</TableHead>
          <TableHead>Sessões</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <ServiceRow key={service.id} service={service} />
        ))}
      </TableBody>
    </Table>
  );
}
