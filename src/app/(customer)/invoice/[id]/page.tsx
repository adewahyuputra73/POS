import { useParams } from "react-router-dom";
import { InvoiceView } from "@/features/invoice";

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  return <InvoiceView orderId={id!} />;
}
