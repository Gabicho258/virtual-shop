import { getOrderById } from "@/actions";
import { OrderStatus, PayPalButton, Title } from "@/components";
import { currencyFormat } from "@/utils";

import Image from "next/image";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;

  const order = await getOrderById(id);
  if (!order) {
    notFound();
  }
  const {
    isPaid,
    total,
    tax,
    subTotal,
    OrderAddress,
    OrderItem,
    itemsInOrder,
  } = order;
  const {
    address,
    address2,
    city,
    countryId: country,
    firstName,
    lastName,
    phone,
    postalCode,
  } = OrderAddress!;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px] ">
        <Title title={`Order N° ${id}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Car */}
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={isPaid} />

            {/* items car */}
            {OrderItem.map(({ product, size, price, quantity }) => (
              <div key={`${product.id}-${size}`} className="flex mb-5">
                <Image
                  src={`/products/${product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                  alt={product.title}
                  className="mr-5 rounded"
                />
                <div>
                  <p>
                    ({quantity}) {product.title} - {size}
                  </p>
                  <p>{currencyFormat(price)}</p>
                  <p className="font-bold">
                    Subtotal: {currencyFormat(price * quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2 font-bold">Address to deliver</h2>
            <div className="mb-10">
              <p>
                {firstName} {lastName}
              </p>
              <p>{address}</p>
              <p>{address2}</p>
              <p>
                {city}, {country}
              </p>
              <p>ZIP: {postalCode}</p>
              <p>Phone: {phone}</p>
            </div>
            {/* divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Order summary</h2>
            <div className="grid grid-cols-2">
              <span>N° products</span>
              <span className="text-right">{itemsInOrder} items</span>
              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(subTotal)}</span>
              <span>Taxes (18%)</span>
              <span className="text-right">{currencyFormat(tax)}</span>
              <span className="mt-5 text-2xl">Total: </span>
              <span className="mt-5 text-2xl text-right">
                {currencyFormat(total)}
              </span>
            </div>
            <div className="mt-5 mb-2 w-full">
              {isPaid ? (
                <OrderStatus isPaid={isPaid} />
              ) : (
                <PayPalButton amount={order.total} orderId={order.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
