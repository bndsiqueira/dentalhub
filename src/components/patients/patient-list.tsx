"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchIcon, UserRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PatientForm } from "@/components/patients/patient-form";

interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
}

interface PatientListProps {
  patients: Patient[];
  searchQuery?: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function PatientList({ patients, searchQuery }: PatientListProps) {
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery ?? "");
  const [openForm, setOpenForm] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    router.push(`/patients${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Pacientes</h1>
          <Badge variant="secondary">{patients.length}</Badge>
        </div>
        <Button onClick={() => setOpenForm(true)}>
          Novo paciente
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">Buscar</Button>
      </form>

      {/* List */}
      {patients.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
          <UserRoundIcon className="size-10 opacity-30" />
          <p className="text-sm">
            {searchQuery
              ? `Nenhum paciente encontrado para "${searchQuery}"`
              : "Nenhum paciente cadastrado ainda."}
          </p>
        </div>
      ) : (
        <div className="grid gap-2">
          {patients.map((patient) => (
            <Link
              key={patient.id}
              href={`/patients/${patient.id}`}
              className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm hover:bg-muted/50 transition-colors"
            >
              {/* Avatar */}
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {getInitials(patient.name)}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col min-w-0">
                <span className="font-medium truncate">{patient.name}</span>
                <span className="text-muted-foreground text-xs truncate">
                  {patient.phone}
                  {patient.email && ` · ${patient.email}`}
                </span>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1 shrink-0">
                {patient.notes && (
                  <Badge variant="outline" className="text-xs">Obs</Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <PatientForm open={openForm} onOpenChange={setOpenForm} />
    </div>
  );
}
