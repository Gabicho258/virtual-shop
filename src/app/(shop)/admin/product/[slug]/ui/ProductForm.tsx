"use client";

import { createUpdateProduct, deleteProductImage } from "@/actions";
import { ProductImage } from "@/components";
import {
  CategoryProduct,
  Product,
  ProductImage as ProductWithImage,
} from "@/interfaces";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[] };
  categories: CategoryProduct[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  sizes: string[];
  inStock: number;
  tags: string;
  gender: "men" | "women" | "kid" | "unisex";
  categoryId: string;
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(", "),
      sizes: product.sizes ?? [],
      images: undefined,

      // title: product.title,
      // slug: product.slug,
      // description: product.description,
      // price: product.price,
      // sizes: product.sizes,
      // inStock: product.inStock,
      // tags: product.tags,
      // gender: product.gender,
      // categoryId: product.categoryId.toString(),
    },
  });
  watch("sizes");
  const onSizeChange = (size: string) => {
    const sizes = new Set(getValues("sizes"));

    if (sizes.has(size)) {
      sizes.delete(size);
    } else {
      sizes.add(size);
    }

    setValue("sizes", Array.from(sizes));
  };
  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();
    const { images, ...productToSave } = data;
    if (product.id) {
      formData.append("id", product.id ?? "");
    }
    formData.append("title", productToSave.title);
    formData.append("slug", productToSave.slug);
    formData.append("description", productToSave.description);
    formData.append("price", productToSave.price.toString());
    formData.append("inStock", productToSave.inStock.toString());
    formData.append("sizes", productToSave.sizes.toString());
    formData.append("tags", productToSave.tags);
    formData.append("categoryId", productToSave.categoryId);
    formData.append("gender", productToSave.gender);
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    const { ok, product: newProductUpdated } = await createUpdateProduct(
      formData
    );

    if (!ok) return alert("Error al guardar el producto");

    router.replace(`/admin/product/${newProductUpdated?.slug}`);
  };

  return (
    <form
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("slug", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            {...register("description", { required: true })}
            className="p-2 border rounded-md bg-gray-200"
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("price", { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("tags", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("gender", { required: true })}
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("categoryId", { required: true })}
          >
            <option value="">[Seleccione]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className={clsx("w-full", {
            "btn-primary": isValid,
            "btn-disabled": !isValid,
          })}
          disabled={!isValid}
          type="submit"
        >
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Stock</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("inStock", { required: true, min: 0 })}
          />
        </div>
        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              // bg-blue-500 text-white <--- si está seleccionado
              <div
                key={size}
                onClick={() => onSizeChange(size)}
                className={clsx(
                  "p-2 border rounded-md mr-2 mb-2 w-14 transition-all text-center cursor-pointer",
                  {
                    "bg-blue-500 text-white": getValues("sizes").includes(size),
                  }
                )}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              type="file"
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg"
              {...register("images")}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id}>
                <ProductImage
                  alt={product.title ?? ""}
                  src={image.url}
                  width={300}
                  height={300}
                  className="rounded-t shadow-md"
                />
                <button
                  className="btn-danger rounded-b-xl w-full "
                  type="button"
                  onClick={() => deleteProductImage(image.id, image.url)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
