import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Link from "next/link";
import CartIcon from "./CartIcon";
import { useAtom } from "jotai";
import { cartItemsAtom } from "../atoms/atoms";

const Navbar = ({ handleCartClick }: { handleCartClick: any }) => {
  const [cartItems] = useAtom(cartItemsAtom);

  return (
    <nav className="flex fixed justify-between bg-[#E6F0FF] border-b items-center w-full h-[72px] z-10">
      <div className="py-4 px-6">
        <Link href="/" className="flex items-center">
          <img src="/starkify-logo.png" alt="starkify" className="h-12 w-12" />
          <span className="text-xl tracking-widest ml-2">starkify</span>
        </Link>
      </div>

      <div className="flex items-center py-4 px-6">
        <Link href="/orders">
          <div className="flex h-full items-center mr-8 hover:underline">
            <span className="text-md">orders</span>
          </div>
        </Link>

        <button
          className="relative mr-8 hover:cursor-pointer hover:scale-110"
          onClick={handleCartClick}
        >
          <CartIcon />
          {cartItems.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cartItems.length}
            </div>
          )}
        </button>

        <DynamicWidget innerButtonComponent="Connect Wallet" />
      </div>
    </nav>
  );
};

export default Navbar;
