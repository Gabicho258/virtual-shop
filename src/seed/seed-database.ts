import { initialData } from "./seed";
import prisma from "../lib/prisma";
async function main() {
  // await Promise.all([
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.category.deleteMany();
  // ]); // puede haber un error por la FK, en caso falla se debe poner await separados
  // category

  const { categories, products, users } = initialData;

  const categoriesData = categories.map((category) => ({
    name: category,
  }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>);

  products.forEach(async (product) => {
    const { images, type, ...rest } = product;
    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  await prisma.user.createMany({ data: users });
  console.log("Seed executed successfully");
}

(() => {
  if (process.env.NODE_ENV === "production") return;
  main();
})();
