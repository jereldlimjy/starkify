import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Link from "next/link";
import CartIcon from "./CartIcon";

const Navbar = ({ handleCartClick }: { handleCartClick: any }) => {
  return (
    <nav className="flex fixed justify-between items-center w-full h-[72px] z-10 border-b bg-white shadow-[0_4px_30px_#0000000d]">
      <Link href="/">
        <div className="flex h-full items-center py-4 px-6">
          <span className="text-xl tracking-widest">starkify</span>
        </div>
      </Link>

      <div className="flex items-center py-4 px-6">
        <button
          className="mr-6 hover:cursor-pointer hover:scale-110"
          onClick={handleCartClick}
        >
          <CartIcon />
        </button>

        <DynamicWidget innerButtonComponent="Connect Wallet" />
      </div>
    </nav>
  );
};

export default Navbar;
