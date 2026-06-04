import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import fetchProducts from "../api/product.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import fetchDetail from "../api/productdetail";
import { AddToCart } from "../api/cart.api";
import { Heart, ShoppingCart, SlidersHorizontal, Star, Truck } from "lucide-react";

const Products = () => {
    const queryClient = useQueryClient();
    const [page] = useState(1);
    const [limit] = useState(10);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const q = (searchParams.get("q") || "").trim();

    const { data, isLoading, error } = useQuery({
        queryKey: ["products", { limit, page, q }],
        queryFn: ({ queryKey: [, params] }) => fetchProducts(params),
        refetchOnWindowFocus: true,
    });

    const products = data?.data || [];

    const prefetchProduct = async (id) => {
        await queryClient.prefetchQuery({
            queryKey: ["product", id],
            queryFn: () => fetchDetail(id),
        });
    };

    const addCartMutation = useMutation({
        mutationFn: AddToCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    const handleAddToCart = (event, productId) => {
        event.stopPropagation();
        addCartMutation.mutate({ product_id: productId });
    };

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
                <p className="text-sm font-medium text-slate-500">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-600">
                Could not load products. Please try again.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">Popular products</p>
                    <h2 className="mt-1 text-3xl font-bold text-slate-950">Shop the latest picks</h2>
                    <p className="mt-2 text-sm text-slate-500">Handpicked items with quick cart actions and product previews.</p>
                </div>

                
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {q && products.length === 0 ? (
                    <div className="col-span-full rounded-xl border border-slate-200 bg-white p-6 text-center text-sm font-medium text-slate-600">
                        No products found for "{q}".
                    </div>
                ) : null}
                {products.map((prod) => (
                    <article
                        onMouseEnter={() => prefetchProduct(prod.id)}
                        onClick={() => navigate(`/product/${prod.id}`)}
                        key={prod.id}
                        className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
                    >
                        <div className="relative bg-slate-100 p-5">
                            <button
                                type="button"
                                onClick={(event) => event.stopPropagation()}
                                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-rose-500"
                                aria-label={`Save ${prod.name}`}
                            >
                                <Heart size={18} />
                            </button>

                            <img
                                src={prod.url}
                                alt={prod.name}
                                className="mx-auto aspect-square h-44 w-full max-w-48 object-contain transition duration-300 group-hover:scale-105"
                            />
                        </div>

                        <div className="space-y-4 p-5">
                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        In stock
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-500">
                                        <Star size={14} fill="currentColor" />
                                        4.8
                                    </span>
                                </div>

                                <h3 className="line-clamp-2 min-h-14 text-base font-semibold leading-7 text-slate-950">
                                    {prod.name}
                                </h3>
                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                    <Truck size={14} />
                                    Free delivery available
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs text-slate-400">Price</p>
                                    <p className="text-xl font-bold text-slate-950">${prod.price}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(event) => handleAddToCart(event, prod.id)}
                                    disabled={addCartMutation.isPending}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-violet-600 text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
                                    aria-label={`Add ${prod.name} to cart`}
                                >
                                    <ShoppingCart size={19} />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Products;
