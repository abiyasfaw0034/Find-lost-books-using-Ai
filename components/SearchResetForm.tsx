"use client";

import Link from "next/link";

const SearchResetForm = () => {
  const reset = () => {
    const form = document.querySelector("search-form") as HTMLFormElement;
    if (form) form.reset();
  };

  return (
    <button type="reset" onClick={reset}>
      <Link href="/" className="search-btn text-white">
        <div className="size-5">x</div>
      </Link>
    </button>
  );
};

export default SearchResetForm;
