import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";
// import { initialData } from "@/seed/seed";

// const products = initialData.products;

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const { page: searchParamsPage } = await searchParams;

  const page = searchParamsPage ? parseInt(searchParamsPage) : 1;

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page });

  // console.log({ currentPage, totalPages });
  if (products.length === 0) redirect("/");

  return (
    <>
      <Title title="Shop" subtitle="All products" className="mb-2" />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </>
  );
}
