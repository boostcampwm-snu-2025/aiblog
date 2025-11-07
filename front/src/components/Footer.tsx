export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="text-center mt-12 py-6 border-t border-gray-200 text-gray-500 text-sm">
      © {year} Git Log. All rights reserved.
    </footer>
  );
};

