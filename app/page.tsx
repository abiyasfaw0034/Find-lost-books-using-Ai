"use client";
import SearchResetForm from "@/components/SearchResetForm";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponse("Failed to fetch response.");
    }

    setLoading(false);
  };
  console.log(response);

  return (
    <div className="flex flex-col w-full mx-auto">
      <div className="relative p-10 text-2xl text-center overflow-hidden">
        {/* Video background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
        >
          <source
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Overlay to make text readable */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 text-2xl font-black text-white">
          Don&apos;t remember the name of the Book? Don&apos;t worry, we got
          you!
        </div>
      </div>

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

      {response && response.length > 0 && (
        <div>
          <div className="px-10 py-2 text-black text-2xl">
            Similar Books with your description
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-10 py-3">
            {response.map((book, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold">
                  {book.title.replace("**", "")}
                </h3>
                <p className="text-sm text-gray-500">Author: {book.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
