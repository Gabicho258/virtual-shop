"use server";

import { CategoryProduct } from "@/interfaces";
import prisma from "@/lib/prisma";

export const getAllCatagories = async (): Promise<{
  ok: boolean;
  categories?: CategoryProduct[];
  message?: string;
}> => {
  try {
    const categories = await prisma.category.findMany();

    return {
      ok: true,
      categories,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: " Error getting all categories",
    };
  }
};
