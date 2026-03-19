import { Link } from "react-router-dom"
export default function Navbar() {
    return (
        <>
            <nav className="  w-full bg-[#F6F3FB] border-b">
                <ul className="w-full flex items-center px-4 py-4">

                    {/* LEFT */}
                    <li >
                        <a href="#" className=" flex items-center mr-16">
                            <img className="w-auto h-9 sm:h-10 md:h-16" src="src/assets/logo.png" alt="" />
                        </a>

                    </li>
                    <div className="flex-1 relative max-w-md mr-auto">
                        {/* Search Icon */}
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <a href="#"><img src="assets\seachicon.png"/></a>
                        </span>

                        {/* Input */}
                        <input
                            type="text"
                            placeholder="Search products"
                            className="w-full bg-[#f2f1f7] pl-10 py-2 pr-3  border rounded-md
                            outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>


                    {/* RIGHT GROUP */}
                    <div className="flex items-center ml-2 gap-8 font-medium text-gray-600">
                        <li className="hover:text-purple-600 cursor-pointer">
                           <Link to="/OrderPage">My Orders</Link>
                        </li>
                        <a href="#">
                            <img src="" alt="" />

                            John Doe
                        </a>
                    </div>
                </ul>
            </nav>
        </>
    )
}