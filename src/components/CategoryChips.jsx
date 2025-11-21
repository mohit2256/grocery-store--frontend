export default function CategoryChips() {
  const items = ["All", "Fresh", "Winter", "Snacks", "Home", "Dairy"];

  return (
    <div className="flex gap-3 overflow-x-auto py-4 px-4 scrollbar-hide">
      {items.map((item) => (
        <button
          key={item}
          className="whitespace-nowrap px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
