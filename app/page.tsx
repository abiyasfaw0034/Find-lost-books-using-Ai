"use client";
import Link from "next/link";
import SearchResetForm from "@/components/SearchResetForm";
import { useState } from "react";

type Book = {
  title: string;
  author: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  // hello
  // console.log("heyy");
  // const handleSubmit = async (e: React.FormEvent) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.response);
      } else {
        console.log("error");
      }
    } catch {
      console.log("error");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full mx-auto">
      <form
        onSubmit={handleSubmit}
        className="search-form flex justify-center items-center px-10 py-3 gap-5"
      >
        <input
          className="w-full p-2 border border-gray-300 rounded"
          value={query}
          placeholder="Write the description of the book you remember..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <SearchResetForm />
        <button
          type="submit"
          className="py-2 bg-blue-500 text-white rounded w-32"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask ME"}
        </button>
      </form>

      {response.length > 0 && (
        <div>
          <div className="px-10 py-2 text-black text-2xl">
            Similar Books with your description
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-10 py-3">
            {response.map((book, index) => (
              <Link
                key={index}
                href={`/book/${encodeURIComponent(book.title)}`}
              >
                <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <h3 className="text-lg font-semibold">
                    {book.title.replace("**", "")}
                  </h3>
                  <p className="text-sm text-gray-500">Author: {book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
