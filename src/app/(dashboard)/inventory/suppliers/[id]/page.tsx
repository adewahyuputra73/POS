import SupplierDetailClient from './_client';

export function generateStaticParams() {
  return [{ id: '0' }];
}

export default function Page() {
  return <SupplierDetailClient />;
}
