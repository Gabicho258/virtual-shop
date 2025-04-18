"use server";

import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith("http")) {
    return {
      ok: false,
      message: "Invalid image URL",
    };
  }
  const imageName = imageUrl.split("/").pop()?.split(".")[0] ?? "";
  try {
    await cloudinary.uploader.destroy(imageName);
    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId,
      },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });
    const { slug } = deletedImage.product;

    revalidatePath(`/admin/products`);
    revalidatePath(`/admin/product/${slug}`);
    revalidatePath(`/product/${slug}`);
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error deleting image",
    };
  }
};
