export const PrimaryButton = ({ sr, onClick, children }) => {
  return (
    <button
      type="submit"
      className="flex justify-center w-full px-4 py-2 text-sm font-medium text-black bg-gray-300 border border-transparent rounded shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      onClick={onClick}
    >
      <span className="sr-only">{sr}</span>
      {children}
    </button>
  );
};
