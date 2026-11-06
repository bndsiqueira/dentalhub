"use client";

import { useState } from "react";
import { PencilIcon, CalendarIcon, CreditCardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { PatientForm, PatientData } from "@/components/patients/patient-form";

interface Service {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  startTime: Date;
  status: string;
  service: Service;
  user: User;
  priceOverride?: number | null;
}

interface Transaction {
  id: string;
  createdAt: Date;
  amount: number;
  status: string;
  paymentMethod?: string | null;
  service: Service;
}

interface Patient extends PatientData {
  cpf?: string | null;
  birthDate?: Date | null;
  email?: string | null;
  address?: string | null;
  insurance?: string | null;
  notes?: string | null;
  appointments: Appointment[];
  transactions: Transaction[];
}

interface PatientDetailProps {
  patient: Patient;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function appointmentStatusLabel(status: string) {
  const map: Record<string, string> = {
    scheduled: "Agendado",
    completed: "Concluído",
    cancelled: "Cancelado",
    no_show: "Não compareceu",
  };
  return map[status] ?? status;
}

function appointmentStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "completed") return "default";
  if (status === "cancelled" || status === "no_show") return "destructive";
  return "secondary";
}

function transactionStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: "Pendente",
    paid: "Pago",
    cancelled: "Cancelado",
  };
  return map[status] ?? status;
}

function transactionStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "paid") return "default";
  if (status === "cancelled") return "destructive";
  return "outline";
}

function paymentMethodLabel(method?: string | null) {
  if (!method) return "—";
  const map: Record<string, string> = {
    cash: "Dinheiro",
    credit_card: "Cartão de crédito",
    debit_card: "Cartão de débito",
    pix: "PIX",
    insurance: "Convênio",
    boleto: "Boleto",
  };
  return map[method] ?? method;
}

export function PatientDetail({ patient }: PatientDetailProps) {
  const [openEdit, setOpenEdit] = useState(false);

  const totalPaid = patient.transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = patient.transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const hasActiveAppointment = patient.appointments.some(
    (a) => a.status === "scheduled"
  );
  const hasPendingPayment = totalPending > 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg">
          {getInitials(patient.name)}
        </div>
        <div className="flex flex-1 flex-col min-w-0">
          <h1 className="text-xl font-semibold">{patient.name}</h1>
          <p className="text-sm text-muted-foreground">
            {patient.phone}
            {patient.email && ` · ${patient.email}`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpenEdit(true)}>
          <PencilIcon className="size-4 mr-1" />
          Editar
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resumo">
        <TabsList>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>

        {/* Resumo Tab */}
        <TabsContent value="resumo">
          <div className="flex flex-col gap-4 pt-4">
            {/* Status badges */}
            {(hasActiveAppointment || hasPendingPayment) && (
              <div className="flex flex-wrap gap-2">
                {hasActiveAppointment && (
                  <Badge variant="default">Em tratamento</Badge>
                )}
                {hasPendingPayment && (
                  <Badge
                    variant="outline"
                    className="border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/30 dark:text-orange-400"
                  >
                    Pagamento pendente
                  </Badge>
                )}
              </div>
            )}

            {/* Personal data */}
            <Card>
              <CardHeader>
                <CardTitle>Dados pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Nome</dt>
                    <dd className="font-medium">{patient.name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Telefone</dt>
                    <dd className="font-medium">{patient.phone}</dd>
                  </div>
                  {patient.email && (
                    <div>
                      <dt className="text-muted-foreground">E-mail</dt>
                      <dd className="font-medium">{patient.email}</dd>
                    </div>
                  )}
                  {patient.cpf && (
                    <div>
                      <dt className="text-muted-foreground">CPF</dt>
                      <dd className="font-medium">{patient.cpf}</dd>
                    </div>
                  )}
                  {patient.birthDate && (
                    <div>
                      <dt className="text-muted-foreground">Data de nascimento</dt>
                      <dd className="font-medium">{formatDate(patient.birthDate)}</dd>
                    </div>
                  )}
                  {patient.insurance && (
                    <div>
                      <dt className="text-muted-foreground">Convênio</dt>
                      <dd className="font-medium">{patient.insurance}</dd>
                    </div>
                  )}
                  {patient.address && (
                    <div className="sm:col-span-2">
                      <dt className="text-muted-foreground">Endereço</dt>
                      <dd className="font-medium">{patient.address}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Observations */}
            {patient.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Observações / Alergias</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{patient.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Atendimentos Tab */}
        <TabsContent value="atendimentos">
          <div className="pt-4">
            {patient.appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
                <CalendarIcon className="size-10 opacity-30" />
                <p className="text-sm">Nenhum atendimento registrado.</p>
              </div>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.appointments.map((appt) => (
                      <TableRow key={appt.id}>
                        <TableCell>{formatDate(appt.startTime)}</TableCell>
                        <TableCell>{appt.service.name}</TableCell>
                        <TableCell>{appt.user.name}</TableCell>
                        <TableCell>
                          {appt.priceOverride != null
                            ? formatCurrency(appt.priceOverride)
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={appointmentStatusVariant(appt.status)}>
                            {appointmentStatusLabel(appt.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Financeiro Tab */}
        <TabsContent value="financeiro">
          <div className="flex flex-col gap-4 pt-4">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Total pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(totalPaid)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Pendente</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
                    {formatCurrency(totalPending)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Transactions table */}
            {patient.transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
                <CreditCardIcon className="size-10 opacity-30" />
                <p className="text-sm">Nenhuma transação registrada.</p>
              </div>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Forma</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{formatDate(tx.createdAt)}</TableCell>
                        <TableCell>{tx.service.name}</TableCell>
                        <TableCell>{formatCurrency(tx.amount)}</TableCell>
                        <TableCell>{paymentMethodLabel(tx.paymentMethod)}</TableCell>
                        <TableCell>
                          <Badge variant={transactionStatusVariant(tx.status)}>
                            {transactionStatusLabel(tx.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <PatientForm patient={patient} open={openEdit} onOpenChange={setOpenEdit} />
    </div>
  );
}
