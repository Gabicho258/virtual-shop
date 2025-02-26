import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import Link from "next/link";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

export default function CheckoutPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px] ">
        <Title title="Verify order" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Car */}
          <div className="flex flex-col mt-5">
            <span className="text-xl ">Verify items</span>
            <Link href={"/cart"} className="underline mb-5">
              Edit cart here
            </Link>
            {/* items car */}
            {productsInCart.map((product) => (
              <div key={product.slug} className="flex mb-5">
                <Image
                  src={`/products/${product.images[0]}`}
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
                  <p>{product.title}</p>
                  <p>${product.price.toFixed(2)} x 3</p>
                  <p className="font-bold">Subtotal: ${product.price * 3}</p>
                  <QuantitySelector quantity={3} />
                  <button className="underline mt-3">Remove</button>
                </div>
              </div>
            ))}
          </div>
          {/* checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2 font-bold">Address to deliver</h2>
            <div className="mb-10">
              <p>Gabriel Antony</p>
              <p>Av. La paz</p>
              <p>Arequipa</p>
              <p>Arequipa</p>
              <p>Perú</p>
              <p>CP 14001</p>
              <p>909090909</p>
            </div>
            {/* divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Order summary</h2>
            <div className="grid grid-cols-2">
              <span>N° products</span>
              <span className="text-right">3 items</span>
              <span>Subtotal</span>
              <span className="text-right">$100</span>
              <span>Taxes (18%)</span>
              <span className="text-right">$100</span>
              <span className="mt-5 text-2xl">Total: </span>
              <span className="mt-5 text-2xl text-right">Total: </span>
            </div>
            <div className="mt-5 mb-2 w-full">
              <p className="mb-5">
                <span className="text-xs">
                  {'Clicking "Add order", you accept our '}{" "}
                  <a href="#" className="underline">
                    terms and conditions
                  </a>
                </span>
              </p>
              <Link
                href={"/orders/123"}
                className="flex btn-primary justify-center "
              >
                Add order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
