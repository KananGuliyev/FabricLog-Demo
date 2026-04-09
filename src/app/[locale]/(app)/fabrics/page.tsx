import { redirect } from "next/navigation";

type FabricsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function FabricsPage({ params }: FabricsPageProps) {
  const { locale } = await params;

  redirect(`/${locale}/products`);
}
