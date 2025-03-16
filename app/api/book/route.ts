import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Extract the slug from the request URL
    const url = new URL(request.url);
    const slug = url.pathname.split("/").pop(); // Get the last part of the URL path

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const decodedSlug = decodeURIComponent(slug);

    // Fetch book details from OpenLibrary
    const searchRes = await fetch(
      `https://openlibrary.org/search.json?title=${decodedSlug}`
    );
    const searchData = await searchRes.json();

    if (searchData.docs.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = searchData.docs[0];
    const bookDetailRes = await fetch(
      `https://openlibrary.org/${book.key}.json`
    );
    const bookDetailData = await bookDetailRes.json();

    const bookDetails = {
      title: book.title,
      author_name: book.author_name || [],
      cover_i: book.cover_i,
      edition_count: book.edition_count,
      first_publish_year: book.first_publish_year,
      subject: book.subject || [],
      description:
        bookDetailData.description?.value ||
        bookDetailData.description ||
        "No description available",
    };

    return NextResponse.json(bookDetails);
  } catch (error) {
    console.error("Error fetching book details:", error);
    return NextResponse.json(
      { error: "Failed to fetch book details" },
      { status: 500 }
    );
  }
}
