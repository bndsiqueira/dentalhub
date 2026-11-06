import { getAllClinics } from "@/actions/admin";
import { ClinicsList } from "@/components/admin/clinics-list";

export default async function AdminClinicsPage() {
  const clinics = await getAllClinics();
  return <ClinicsList clinics={clinics} />;
}
