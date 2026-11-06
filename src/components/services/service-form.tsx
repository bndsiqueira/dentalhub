"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { createService, updateService } from "@/actions/services";

export const COLORS = [
  { label: "Azul", value: "#3b82f6" },
  { label: "Roxo", value: "#8b5cf6" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Amarelo", value: "#f59e0b" },
  { label: "Vermelho", value: "#ef4444" },
  { label: "Ciano", value: "#06b6d4" },
  { label: "Verde", value: "#22c55e" },
  { label: "Rosa", value: "#ec4899" },
];

const CATEGORIES = ["Prevenção", "Tratamento", "Estético", "Cirúrgico"];

export interface ServiceData {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  price: number;
  durationMinutes: number;
  defaultSessions: number;
  color: string;
}

interface ServiceFormProps {
  service?: ServiceData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceForm({ service, open, onOpenChange }: ServiceFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [category, setCategory] = useState(service?.category ?? "");
  const [price, setPrice] = useState(service?.price?.toString() ?? "");
  const [duration, setDuration] = useState(service?.durationMinutes?.toString() ?? "");
  const [sessions, setSessions] = useState(service?.defaultSessions?.toString() ?? "1");
  const [color, setColor] = useState(service?.color ?? COLORS[0].value);

  function resetForm() {
    setName(service?.name ?? "");
    setDescription(service?.description ?? "");
    setCategory(service?.category ?? "");
    setPrice(service?.price?.toString() ?? "");
    setDuration(service?.durationMinutes?.toString() ?? "");
    setSessions(service?.defaultSessions?.toString() ?? "1");
    setColor(service?.color ?? COLORS[0].value);
    setError(null);
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const priceNum = parseFloat(price);
    const durationNum = parseInt(duration, 10);
    const sessionsNum = parseInt(sessions, 10);

    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }
    if (!category) {
      setError("Categoria é obrigatória");
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Preço deve ser maior que zero");
      return;
    }
    if (isNaN(durationNum) || durationNum <= 0) {
      setError("Duração deve ser maior que zero");
      return;
    }

    startTransition(async () => {
      const input = {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        price: priceNum,
        durationMinutes: durationNum,
        defaultSessions: sessionsNum || 1,
        color,
      };

      const result = service
        ? await updateService(service.id, input)
        : await createService(input);

      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        handleOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {service ? "Editar serviço" : "Novo serviço"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Limpeza dental"
              disabled={isPending}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o serviço..."
              rows={3}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
              <SelectTrigger id="category" className="w-full" disabled={isPending}>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0,00"
                disabled={isPending}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="duration">Duração (min)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                step="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="sessions">Sessões padrão</Label>
              <Input
                id="sessions"
                type="number"
                min="1"
                step="1"
                value={sessions}
                onChange={(e) => setSessions(e.target.value)}
                placeholder="1"
                disabled={isPending}
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Cor</Label>
              <Select value={color} onValueChange={(v) => setColor(v ?? COLORS[0].value)}>
                <SelectTrigger className="w-full" disabled={isPending}>
                  <SelectValue>
                    {() => (
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block size-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {COLORS.find((c) => c.value === color)?.label ?? "Cor"}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <span
                        className="inline-block size-3 rounded-full"
                        style={{ backgroundColor: c.value }}
                      />
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? service
                  ? "Salvando..."
                  : "Criando..."
                : service
                  ? "Salvar alterações"
                  : "Criar serviço"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
