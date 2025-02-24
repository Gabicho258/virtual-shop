// import { notFound } from "next/navigation";

import { ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";
import { initialData } from "@/seed/seed";

interface Props {
  params: {
    id: Category;
  };
}

export default function CategoryPage({ params }: Props) {
  const { id } = params;
  const products = initialData.products.filter(
    (product) => product.gender === id
  );
  const labels: Record<Category, string> = {
    men: "para hombres",
    women: "para mujeres",
    kid: "para niños",
    unisex: "para todos",
  };

  // if (id === "kids") {
  //   notFound();
  // }

  return (
    <div>
      <Title
        title={`Articulos de ${labels[id]}`}
        subtitle={`Todos los productos ${labels[id]}`}
        className="mb-2"
      />
      <ProductGrid products={products} />
    </div>
  );
}
