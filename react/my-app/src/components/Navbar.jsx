import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../Context/AuthContext";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  UserRound,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const userTypedRef = useRef(false);

  const username = user?.sub || user?.name || "Account";

  const limitToThreeWords = useMemo(() => {
    return (value) => {
      const words = value.trim().split(/\s+/).filter(Boolean).slice(0, 3);
      return words.join(" ");
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchValue(limitToThreeWords(q));
    userTypedRef.current = false;
    setIsAdmin(Boolean(localStorage.getItem("admin_token")));
  }, [location.pathname, location.search, limitToThreeWords]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!userTypedRef.current && location.pathname !== "/Dashboard") return;

      const q = limitToThreeWords(searchValue);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      const qs = params.toString();
      const target = `/Dashboard${qs ? `?${qs}` : ""}`;
      const current = `${location.pathname}${location.search || ""}`;
      if (current !== target) navigate(target, { replace: true });
    }, 350);

    return () => clearTimeout(id);
  }, [searchValue, navigate, limitToThreeWords, location.pathname, location.search]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="max-w-7xl mx-auto flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center">
        {/* Left */}
        <div className="flex items-center justify-between gap-4">
          <Link to="/Dashboard" className="flex items-center gap-3">
            <span className="font-md font-semibold text-slate-900">
              SwiftCart
            </span>
          </Link>

          <Link
            to="/Cart"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-violet-600 text-white lg:hidden"
            aria-label="Open cart"
          >
            <ShoppingCart size={19} />
          </Link>
        </div>

        {/* Search */}
        <div className="relative flex-1 lg:max-w-xl">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products"
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
            value={searchValue}
            onChange={(e) => {
              userTypedRef.current = true;
              setSearchValue(limitToThreeWords(e.target.value));
            }}
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 overflow-x-auto text-sm font-semibold text-slate-600">
          <Link
            to="/Dashboard"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <ShoppingBag size={17} />
            Shop
          </Link>

          <Link
            to="/OrderPage"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <Package size={17} />
            Orders
          </Link>

          {isAdmin ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-violet-50 hover:text-violet-700"
            >
              Admin
            </Link>
          ) : null}

          <Link
            to="/Cart"
            className="hidden items-center gap-2 rounded-md px-3 py-2 transition hover:bg-violet-50 hover:text-violet-700 lg:inline-flex"
          >
            <ShoppingCart size={17} />
            Cart
          </Link>

          <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
            <UserRound size={17} />
            <span className="max-w-32 truncate">{username}</span>
          </span>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
