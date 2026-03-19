
import AddToCart from "../api/cart.api";
import Orderplaced from "../api/order.api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import fetchCart from "../api/cart.api";
import { decreased } from "../api/cart.api";
import { useQuery, useMutation } from "@tanstack/react-query"

const Cart = () => {
    const navigate = useNavigate()

    const { data, refetch, isLoading, error } = useQuery({
        queryKey: ["cartitems"],
        queryFn: fetchCart,
        staleTime:0,
        gcTime:0
    })
    // const {data1,isLoading1,error1}  = useQuery({
    //         queryKey:["increase"],
    //         queryFn:fetchCart
    // })
    const decreaseItem = useMutation({

        mutationFn: (product_id) => {
            return decreased(product_id)
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cartitems"]
            });

            queryClient.refetchQueries({
                queryKey: ["cartitems"]
            });
            refetch();
        }
        

    })
    console.log(data);


    // useEffect(() => {
    //     const getapi = async () => {
    //         try {
    //             const cart = await fetchCart()
    //             setitems(cart.data.items)
    //         }
    //         catch (err) {
    //             console.log(err);
    //         }
    //     }
    //     getapi()
    // }, [])
    const Orderplacing = async () => {
        const res = await Orderplaced()
        if (res.status == 200 || res.status == 201) {
            console.log("order has been placed");
            navigate("/Order")
        }
    }
    function handleShipping() {
        navigate("/Shipping")
    }
    return (
        <>
            <Navbar />
            <div class="w-full bg-indigo-50 min-h-screen  grid grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] items-start gap-6 px-6">
                <div className="w-full mt-4 p-6 rounded-md bg-white ">
                    <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] font-semibold ">Your items</h1>
                    <div className="border-b  grid grid-cols-[1fr_120px] p-2 font-medium">
                        <span className="flex justify-start">items</span>
                        <span className="flex justify-end "> quantity</span>
                    </div>
                    <div className="divide-y  border-[#E8EF23] rounded-md ">
                        {data?.data?.items.length === 0 && (
                            <div className=" flex justify-center items-center py-20">
                                <p className="font-bold text-[16px] sm:text-[24px] lg:text-[32px] text-gray-500">
                                    Your Cart is empty
                                </p>
                            </div>
                        )}

                        {
                            data?.data?.items.map((item) => (
                                <div key={item.id} className="grid grid-cols-[1fr_120px] items-center pt-2">
                                    <div className="flex items-center gap-4">
                                        <img src={item.product.url} className="w-24 h-24 rounded-md object-cover bg-gray-200" />
                                        <div>
                                            <p className="flex flex-col font-medium  text-[#2E2A55]">{item.product.name}</p>
                                            <p>descirptoen aisdfuisa fyaiyasbfajs</p>
                                            <p className=" flex flex-col text-indigo-600">Rs {item.product.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex ml-8 bg-indigo-50  rounded-md w-20 h-8 ">
                                        <button onClick={() => { }} className="w-8 h-full flex items-center justify-center">+</button>
                                        <p className=" flex items-center justify-center w-8 h-full">{item.quantity}</p>
                                        <button onClick={() => { decreaseItem.mutate(item.product.id) }} className=" w-8 h-full flex items-center justify-center">-</button>
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="min-w-1/2 lg:w-full bg-white rounded-md px-2 mt-4 border-b-1 ">
                    <div className="flex flex-col  p-4 font-medium">
                        <div className="divide-y  border-b border-white  text-[16px] lg:text-[22px] pb-2">
                            Subtotal (item):{
                                
                            }
                        </div>
                        <div className="flex flex-col mt-2">
                            <button onClick={handleShipping} className="bg-[#9333EA] rounded-md py-2 focus:to-blue-400 transition text-white ">Proceed to Buy</button>
                        </div>
                    </div>
                </div>
            </div>



            {/* <div className="grid grid-rows-1 bg-blue-700">
                   <li>items</li>
                     <div className="bg-red-500 flex  h-32 items-center ">
                        <div className="bg-blue-500 ">
                            items
                        </div>
                     </div>
                   </div> */}


        </>
    )
}
export default Cart