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
import { createPatient, updatePatient } from "@/actions/patients";

export interface PatientData {
  id: string;
  name: string;
  phone: string;
  cpf?: string | null;
  birthDate?: Date | null;
  email?: string | null;
  address?: string | null;
  insurance?: string | null;
  notes?: string | null;
}

interface PatientFormProps {
  patient?: PatientData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientForm({ patient, open, onOpenChange }: PatientFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(patient?.name ?? "");
  const [phone, setPhone] = useState(patient?.phone ?? "");
  const [cpf, setCpf] = useState(patient?.cpf ?? "");
  const [birthDate, setBirthDate] = useState(
    patient?.birthDate ? new Date(patient.birthDate).toISOString().split("T")[0] : ""
  );
  const [email, setEmail] = useState(patient?.email ?? "");
  const [insurance, setInsurance] = useState(patient?.insurance ?? "");
  const [address, setAddress] = useState(patient?.address ?? "");
  const [notes, setNotes] = useState(patient?.notes ?? "");

  function resetForm() {
    setName(patient?.name ?? "");
    setPhone(patient?.phone ?? "");
    setCpf(patient?.cpf ?? "");
    setBirthDate(
      patient?.birthDate ? new Date(patient.birthDate).toISOString().split("T")[0] : ""
    );
    setEmail(patient?.email ?? "");
    setInsurance(patient?.insurance ?? "");
    setAddress(patient?.address ?? "");
    setNotes(patient?.notes ?? "");
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

    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }
    if (!phone.trim()) {
      setError("Telefone é obrigatório");
      return;
    }

    startTransition(async () => {
      const input = {
        name: name.trim(),
        phone: phone.trim(),
        cpf: cpf.trim() || undefined,
        birthDate: birthDate || undefined,
        email: email.trim() || undefined,
        insurance: insurance.trim() || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      const result = patient
        ? await updatePatient(patient.id, input)
        : await createPatient(input);

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
            {patient ? "Editar paciente" : "Novo paciente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5 col-span-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                disabled={isPending}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                disabled={isPending}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                disabled={isPending}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="birthDate">Data de nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                disabled={isPending}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="insurance">Convênio</Label>
              <Input
                id="insurance"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                placeholder="Nome do convênio"
                disabled={isPending}
              />
            </div>

            <div className="grid gap-1.5 col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, bairro, cidade"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="notes">Observações / Alergias</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anotações relevantes, alergias a medicamentos..."
              rows={3}
              disabled={isPending}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? patient
                  ? "Salvando..."
                  : "Criando..."
                : patient
                  ? "Salvar alterações"
                  : "Criar paciente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
