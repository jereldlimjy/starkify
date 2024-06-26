const CartIcon = ({
  className,
  height,
  width,
}: {
  className?: string;
  height?: string;
  width?: string;
}) => {
  return (
    <svg
      className={className}
      fill="#000000"
      viewBox="0 0 256 256"
      height={height ? `${height}px` : `38px`}
      width={width ? `${width}px` : `38px`}
      xmlns="http://www.w3.org/2000/svg"
      stroke="#000000"
      strokeWidth="5.12"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M92,216a12,12,0,1,1-12-12A12,12,0,0,1,92,216Zm92-12a12,12,0,1,0,12,12A12,12,0,0,0,184,204ZM225.55957,73.09863l-26.39844,92.396A20.08264,20.08264,0,0,1,179.93164,180H84.06836a20.0825,20.0825,0,0,1-19.22949-14.50586L38.457,73.15967c-.01172-.03906-.02344-.07813-.03418-.11719L28.669,38.90137A4.01781,4.01781,0,0,0,24.82227,36H8a4,4,0,0,1,0-8H24.82227a12.051,12.051,0,0,1,11.53808,8.70312L45.30273,68H221.71387a3.99956,3.99956,0,0,1,3.8457,5.09863ZM216.41113,76H47.58887l24.9414,87.29639A12.0503,12.0503,0,0,0,84.06836,172h95.86328a12.05045,12.05045,0,0,0,11.53809-8.70312Z"></path>{" "}
      </g>
    </svg>
  );
};

export default CartIcon;
