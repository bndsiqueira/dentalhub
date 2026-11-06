import { notFound } from "next/navigation";
import { getPatientById } from "@/actions/patients";
import { PatientDetail } from "@/components/patients/patient-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PatientPage({ params }: Props) {
  const { id } = await params;
  const patient = await getPatientById(id);
  if (!patient) notFound();
  return <PatientDetail patient={patient} />;
}
