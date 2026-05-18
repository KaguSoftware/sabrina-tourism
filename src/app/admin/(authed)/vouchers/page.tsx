import { PageHeader } from "@/components/admin/PageHeader/PageHeader";
import { getAdminT } from "@/lib/admin/i18n";
import { VoucherGenerator } from "./VoucherGenerator";
import {
  listPackagesForVoucher,
  listDailyPackagesForVoucher,
  listHotelsForVoucher,
  listVehiclesForVoucher,
} from "./actions";

export default async function AdminVouchersPage() {
  const { t } = await getAdminT();
  const [packages, dailyPackages, hotels, vehicles] = await Promise.all([
    listPackagesForVoucher(),
    listDailyPackagesForVoucher(),
    listHotelsForVoucher(),
    listVehiclesForVoucher(),
  ]);

  return (
    <>
      <PageHeader
        kicker={t("pages.vouchers.kicker")}
        title={t("pages.vouchers.title")}
        description={t("pages.vouchers.description")}
      />
      <VoucherGenerator
        packages={packages}
        dailyPackages={dailyPackages}
        hotels={hotels}
        vehicles={vehicles}
      />
    </>
  );
}
