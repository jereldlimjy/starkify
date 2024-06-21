import React, { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { cartItemsAtom, isDrawerOpenAtom } from "../atoms/atoms";

interface SideDrawerProps {
  handleCartClick: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ handleCartClick }) => {
  const [cartItems] = useAtom(cartItemsAtom);
  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      drawerRef.current &&
      !drawerRef.current.contains(event.target as Node)
    ) {
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen]);

  return (
    <>
      {/* Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 bg-gray-100 bg-opacity-75 transition-opacity" />
      )}

      {/* Side Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 w-[35vw] h-full bg-white shadow-lg z-50 p-4 ease-in-out duration-500 transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={handleCartClick}
          className="absolute top-2 right-2 text-gray-600"
        >
          Close
        </button>
        <h2 className="text-xl font-semibold mb-4">Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item: any) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SideDrawer;
