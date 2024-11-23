import React, { useState } from "react";
import '../style/SearchPage.css';


export default function SearchPage() {
//   const [term, setTerm] = useState("");
//   const [limit, setLimit] = useState(5);
//   const [books, setBooks] = useState([]);
//   const [numResults, setNumResults] = useState(0);

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent form submission
//     const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${term}&maxResults=${limit}`;
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       setBooks(data.items || []);
//       setNumResults(data.items ? data.items.length : 0);
//     } catch (error) {
//       console.error("Error fetching books:", error);
//       alert("Error fetching books. Please try again.");
//     }
//   };

//   const createRow = (book) => {
//     const volumeInfo = book.volumeInfo || {};
//     return (
//       <div className="row mb-4" key={book.id}>
//         <div className="col-md-3">
//           <img
//             src={volumeInfo.imageLinks?.thumbnail || ""}
//             alt={volumeInfo.title || "N/A"}
//             className="img-fluid"
//           />
//         </div>
//         <div className="col-md-9">
//           <h3>{volumeInfo.title || "No Title"}</h3>
//           <p><strong>Author:</strong> {volumeInfo.authors?.join(", ") || "N/A"}</p>
//           <p><strong>Pages:</strong> {volumeInfo.pageCount || "N/A"}</p>
//           <p><strong>Rating:</strong> {volumeInfo.averageRating || "N/A"}</p>
//           <p><strong>Published Date:</strong> {volumeInfo.publishedDate || "N/A"}</p>
//         </div>
//       </div>
//     );
//   };

  return (
    <div className="container text-center">
      <div id="title" className="my-4">
        <h1>Welcome to Search Page!</h1>
      </div>

      <form id="search-form" className="d-flex justify-content-center mb-4" onSubmit={handleSubmit}>
        <input
          className="form-control me-2"
          type="text"
          id="search-term"
          placeholder="Search Book..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <select
          id="search-limit"
          className="form-select me-2"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        >
          {[5, 10, 15, 30, 50, 100].map((value) => (
            <option key={value} value={value}>
              {value} results
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-outline-success">Submit</button>
      </form>

      <small id="submit-error"></small>

      <div id="message" className="mb-4">
        Showing <span id="num-results">{numResults}</span> result(s).
      </div>

      <div id="content" className="row justify-content-center">
        {books.map(createRow)}
      </div>

      <div id="footer" className="mt-4">
        <p>Yiting Li Final Project ITP 303 &copy; 2024</p>
      </div>
    </div>
  );
}
