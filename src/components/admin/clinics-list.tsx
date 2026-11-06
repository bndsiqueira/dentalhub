"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Users, Stethoscope, Calendar, DollarSign } from "lucide-react";

interface Clinic {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  createdAt: Date;
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  }>;
  _count: {
    patients: number;
    services: number;
    appointments: number;
    leads: number;
    treatments: number;
    transactions: number;
  };
}

interface ClinicsListProps {
  clinics: Clinic[];
}

export function ClinicsList({ clinics }: ClinicsListProps) {
  const totalClinics = clinics.length;
  const totalUsers = clinics.reduce((sum, c) => sum + c.users.length, 0);
  const totalPatients = clinics.reduce((sum, c) => sum + c._count.patients, 0);
  const totalAppointments = clinics.reduce((sum, c) => sum + c._count.appointments, 0);

  const formatDate = (date: Date) => new Date(date).toLocaleDateString("pt-BR");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Clínicas / Dentistas</h1>
        <p className="text-muted-foreground">
          Visão geral de todas as clínicas e dentistas cadastrados no sistema
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalClinics}</div>
              <div className="text-xs text-muted-foreground">Clínicas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-violet-500/10 p-2">
              <Users className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <div className="text-xs text-muted-foreground">Usuários</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-teal-500/10 p-2">
              <Stethoscope className="h-5 w-5 text-teal-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <div className="text-xs text-muted-foreground">Pacientes (total)</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-amber-500/10 p-2">
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <div className="text-xs text-muted-foreground">Agendamentos (total)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinics list */}
      <div className="space-y-4">
        {clinics.map((clinic) => (
          <Card key={clinic.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{clinic.name}</CardTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {clinic.phone && <span>{clinic.phone}</span>}
                      {clinic.address && <span>{clinic.address}</span>}
                      <span>Criada em {formatDate(clinic.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {clinic._count.patients} pacientes
                  </Badge>
                  <Badge variant="secondary">
                    {clinic._count.services} serviços
                  </Badge>
                  <Badge variant="secondary">
                    {clinic._count.appointments} agendamentos
                  </Badge>
                  <Badge variant="secondary">
                    {clinic._count.leads} leads
                  </Badge>
                  <Badge variant="secondary">
                    {clinic._count.transactions} transações
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium text-muted-foreground mb-2">Usuários</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clinic.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.role === "owner" ? "Proprietário" : "Equipe"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}

        {clinics.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Nenhuma clínica cadastrada ainda.
          </div>
        )}
      </div>
    </div>
  );
}
