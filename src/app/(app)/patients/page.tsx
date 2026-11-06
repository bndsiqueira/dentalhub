import { getPatients } from "@/actions/patients";
import { PatientList } from "@/components/patients/patient-list";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function PatientsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const patients = await getPatients(q);
  return <PatientList patients={patients} searchQuery={q} />;
}
