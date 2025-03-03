import {
  ProductMobileSlideShow,
  ProductSlideShow,
  QuantitySelector,
  SizeSelector,
} from "@/components";
import { monserrat } from "@/config/fonts";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = initialData.products.find((product) => product.slug === slug);
  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Sildes */}
      <div className="col-span-1 md:col-span-2">
        {/* mobile slideshow */}
        <ProductMobileSlideShow
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />
        {/* desktop slideshow */}
        <ProductSlideShow
          title={product.title}
          images={product.images}
          className="md:block hidden"
        />
      </div>
      <div className="col-span-1 px-5">
        <h1 className={`${monserrat.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className="text-lg mb-5">${product.price.toFixed(2)}</p>

        {/* size selector */}
        <SizeSelector selectedSize={product.sizes[0]} sizes={product.sizes} />
        {/* quantity selector */}
        <QuantitySelector quantity={2} />

        {/* button */}
        <button className="btn-primary my-5">Add to cart</button>
        {/* description */}
        <h3 className="font-bold text-sm ">Description</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
