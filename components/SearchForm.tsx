import Form from "next/form";
import SearchResetForm from "./SearchResetForm";

const SearchForm = ({ query }: { query?: string }) => {
  return (
    <Form
      action="./"
      scroll={false}
      className="search-form flex items-center justify-center p-10 "
    >
      <input
        name="query"
        defaultValue={query}
        className="search-input"
        placeholder="Search Startups"
      />

      <div className="flex gap-2">{query && <SearchResetForm />}</div>

      <button type="submit" className="search-btn bg-green-200">
        Search
      </button>
    </Form>
  );
};

export default SearchForm;
