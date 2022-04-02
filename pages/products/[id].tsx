import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { Product } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";

interface ProductWithUser extends Product {
  user: {
    id: number;
    avatar?: string;
    name: string;
  };
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav, { loading }] = useMutation(
    `/api/products/${router.query.id}/fav`
  );
  const onFavClick = () => {
    toggleFav({});
    boundMutate((prev) => prev && { ...prev, isLiked: !prev?.isLiked }, false);
    /*  mutate(
      "/api/users/me",
      (prev: any) => prev && { ...prev, ok: !prev.ok },
      false
    ); */
  };

  return (
    <Layout canGoBack>
      <div className="px-4  py-4">
        <div className="mb-8">
          {data?.product.image ? (
            <div className="relative aspect-video h-96 w-full">
              <Image
                src={`https://imagedelivery.net/h3kJx8b63YkXouCAFpwF5w/${data?.product.image}/public`}
                className="h-96 bg-slate-300 object-cover"
                //alt="product"
                layout="fill"
              />
            </div>
          ) : (
            <div className="h-96 bg-slate-300" />
          )}
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            <div className="relative h-12 w-12  ">
              {data?.product.user.avatar ? (
                <Image
                  src={`https://imagedelivery.net/h3kJx8b63YkXouCAFpwF5w/${data?.product.user.avatar}/avatar`}
                  className="rounded-full  object-cover"
                  layout="fill"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-slate-300" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {data?.product?.user.name}
              </p>
              <Link href={`/users/profile/${data?.product.user.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {data?.product?.name}
            </h1>
            <span className="mt-3 block text-2xl text-gray-900">
              $ {data?.product?.price}
            </span>
            <p className=" my-6 text-gray-700">{data?.product?.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button
                onClick={onFavClick}
                className={cls(
                  "flex items-center justify-center rounded-md p-3 hover:bg-gray-100",
                  data?.isLiked
                    ? "text-red-600 hover:text-red-600"
                    : "text-gray-400 hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts?.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <a>
                  <div className="mb-4 h-56 w-full bg-slate-300" />
                  <h3 className="-mb-1 text-gray-700">{product.name}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    $ {product.price}
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ItemDetail;
