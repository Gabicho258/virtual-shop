"use client";

import { getStockBySlug } from "@/actions";
import { monserrat } from "@/config/fonts";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}
export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getStock = async () => {
      const stock = await getStockBySlug(slug);
      setStock(stock);
      setIsLoading(false);
    };
    getStock();
  }, [slug]);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200">&nbsp;</div>;
  }

  return (
    <h1 className={`${monserrat.className} antialiased font-bold text-lg`}>
      Stock: {stock}
    </h1>
  );
};
