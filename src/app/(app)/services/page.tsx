import { getServices } from "@/actions/services";
import { ServiceTable } from "@/components/services/service-table";
import { ServicePageHeader } from "@/components/services/service-page-header";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div>
      <ServicePageHeader />
      <div className="mt-6 rounded-lg border">
        <ServiceTable services={services} />
      </div>
    </div>
  );
}
