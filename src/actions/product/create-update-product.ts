"use server";

import prisma from "@/lib/prisma";
import { Gender, Product, Size } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.trim().split(",")),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const parsedData = productSchema.safeParse(data);
  if (!parsedData.success) {
    console.error("Validation errors:", parsedData.error.format());
    return { ok: false };
  }
  const product = parsedData.data;
  const { id, ...rest } = product;
  product.slug = product.slug.toLowerCase().replace(/ /g, "-").trim();

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;

      const tagsArray = rest.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());

      if (id) {
        product = await tx.product.update({
          where: { id },
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      } else {
        product = await tx.product.create({
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      }
      if (formData.getAll("images")) {
        const images = await uploadImages(formData.getAll("images") as File[]);
        console.log(images);
        if (!images) {
          throw new Error("Error uploading images");
        }
        await tx.productImage.createMany({
          data: images.map((image) => ({
            url: image!,
            productId: product.id,
          })),
        });
      }

      return { product };
    });
    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${product.slug}`);
    revalidatePath(`/products/${product.slug}`);

    return { ok: true, product: prismaTx.product };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Can not save de product" };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        return cloudinary.uploader
          .upload(`data:image/jpeg;base64,${base64}`)
          .then((result) => result.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
        return null;
      }
    });
    const uploadedImages = await Promise.all(uploadPromises);

    return uploadedImages;
  } catch (error) {
    console.log(error);
    return null;
  }
};
