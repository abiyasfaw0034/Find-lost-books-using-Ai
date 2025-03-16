import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = decodeURIComponent(params.slug);

    // Fetch book details
    const res = await fetch(
      `https://openlibrary.org/search.json?title=${slug}`
    );
    const data = await res.json();

    if (data.docs.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = data.docs[0];
    // console.log(book.key);
    // Fetch additional book details
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
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(String(error));
    }
    return NextResponse.json(
      { error: "Failed to fetch book details" },
      { status: 500 }
    );
  }
}
