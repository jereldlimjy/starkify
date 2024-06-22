import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Link from "next/link";
import CartIcon from "./CartIcon";
import { useAtom } from "jotai";
import { cartItemsAtom } from "../atoms/atoms";

const Navbar = ({ handleCartClick }: { handleCartClick: any }) => {
  const [cartItems] = useAtom(cartItemsAtom);

  return (
    <nav className="flex fixed justify-between items-center w-full h-[72px] z-10 border-b bg-white shadow-[0_4px_30px_#0000000d]">
      <Link href="/">
        <div className="flex h-full items-center py-4 px-6">
          <span className="text-xl tracking-widest">starkify</span>
        </div>
      </Link>

      <div className="flex items-center py-4 px-6">
        <button
          className="relative mr-6 hover:cursor-pointer hover:scale-110"
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
