"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type BookDetails = {
  title: string;
  author_name: string[];
  cover_i: number;
  edition_count: number;
  first_publish_year?: number;
  subject?: string[];
  description?: string;
};

export default function DetailPage() {
  const [loading, setLoading] = useState(false);
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const { slug } = useParams();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    const fetchBookDetails = async () => {
      try {
        const s = encodeURIComponent(slug as string);
        const res = await fetch(`/api/book/${s}`);
        const data = await res.json();

        if (res.ok) {
          setBookDetails(data);
        } else {
          console.error("Error fetching book:", data.error);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [slug]);

  if (loading)
    return <div className="text-center text-3xl p-20">Loading...</div>;
  if (!bookDetails)
    return <div className="text-3xl p-20 m-10">Book not found</div>;

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <div className="px-20 text-black text-2xl">Book Details</div>
        <Link href={"/"}>
          <div className="text-xl hover:text-blue-500 px-20">👈 Home</div>
        </Link>
      </div>
      <div className="flex py-10 px-20 gap-20">
        <div className="flex-[1]">
          {bookDetails.cover_i && (
            <img
              src={`https://covers.openlibrary.org/b/id/${bookDetails.cover_i}-L.jpg`}
              alt={bookDetails.title}
              className="mt-4 w-[80%] h-96 "
            />
          )}
        </div>
        <div className="flex-[2]">
          <h2 className="text-xl font-bold">Title: {bookDetails.title}</h2>
          <p>Author: {bookDetails.author_name.join(", ") || "Unknown"}</p>
          <p>Edition Count: {bookDetails.edition_count}</p>
          <p>First Published: {bookDetails.first_publish_year ?? "Unknown"}</p>

          <p className="mt-4">{bookDetails.description}</p>
        </div>
      </div>
    </div>
  );
}
