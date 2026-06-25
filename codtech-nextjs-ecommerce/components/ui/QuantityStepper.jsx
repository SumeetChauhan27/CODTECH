export default function QuantityStepper({ quantity, setQuantity, min = 1, onUpdate }) {
  const decrease = () => {
    if (quantity > min) {
      if (onUpdate) onUpdate(quantity - 1);
      else setQuantity(quantity - 1);
    }
  };
  const increase = () => {
    if (onUpdate) onUpdate(quantity + 1);
    else setQuantity(quantity + 1);
  };
  return (
    <div className="flex items-center border border-gray-300 rounded-lg">
      <button 
        className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        onClick={decrease}
        disabled={quantity <= min}
      >
        -
      </button>
      <span className="px-4 py-2 font-medium">{quantity}</span>
      <button 
        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
        onClick={increase}
      >
        +
      </button>
    </div>
  );
}