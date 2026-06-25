import Link from "next/link";
export default function Breadcrumb({ category, name }) {
  return (
    <nav className="text-sm mb-6 text-gray-500">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <Link href="/" className="hover:text-orange-600">Home</Link>
          <span className="mx-2">/</span>
        </li>
        <li className="flex items-center">
          <Link href={"/products?category=" + encodeURIComponent(category)} className="hover:text-orange-600">{category}</Link>
          <span className="mx-2">/</span>
        </li>
        <li className="text-gray-900 font-medium truncate max-w-xs">{name}</li>
      </ol>
    </nav>
  );
}