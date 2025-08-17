"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Breadcrumb({ items }: { items: { label: string; href: string }[] }) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <nav className="flex justify-between items-center text-sm text-gray-600  mt-2 containerBox">
      <ul className="flex items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index}>
              {!isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-green-600 transition"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-500 font-semibold">{item.label}</span>
              )}
              {!isLast && <span className="text-gray-500"> /</span>}
            </li>
          );
        })}
      </ul>
      <button
        onClick={handleBack}
        className="hover:text-green-600 transition font-semibold"
      >
        Voltar
      </button>
    </nav>
  );
}
