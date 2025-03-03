// import { notFound } from "next/navigation";
export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    gender: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { gender } = await params;
  const { page: searchParamsPage } = await searchParams;

  const page = searchParamsPage ? parseInt(searchParamsPage) : 1;

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page, gender: gender as Gender });

  // console.log({ currentPage, totalPages });
  if (products.length === 0) redirect(`/gender/${gender}`);

  const labels: Record<string, string> = {
    men: "para hombres",
    women: "para mujeres",
    kid: "para niños",
    unisex: "para todos",
  };

  // if (gender === "kids") {
  //   notFound();
  // }

  return (
    <div>
      <Title
        title={`Articulos de ${labels[gender]}`}
        subtitle={`Todos los productos ${labels[gender]}`}
        className="mb-2"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
