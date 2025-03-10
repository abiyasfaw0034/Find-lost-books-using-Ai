import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { query } = await req.json(); // Get query from request body

    // Modify the prompt to return a list format without numbering
    const q1 = `
      I will provide a description of books, and you should only return the book names and authors in the following format:
      Title: [Book Name], Author: [Author Name]
      Do not include any other information or explanation.
      Please provide a list of books that match the description.
      Description: ${query}
    `;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Get response from Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: q1 }],
      model: "llama-3.3-70b-versatile",
    });

    const aiResponse =
      chatCompletion.choices[0]?.message?.content || "No response";

    // Return the response in a structured list
    const booksList = aiResponse
      .split("\n")
      .map((line) => {
        const [title, author] = line.split(", Author: ");
        if (title && author) {
          return { title: title.replace("Title: ", ""), author: author };
        }
      })
      .filter((book) => book);

    return NextResponse.json({ response: booksList });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
