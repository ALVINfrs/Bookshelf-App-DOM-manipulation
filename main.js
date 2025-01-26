const bookForm = document.getElementById("bookForm");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const filter = document.getElementById("filter");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("themeToggle");
const searchForm = document.getElementById("searchBook");
const searchBookTitle = document.getElementById("searchBookTitle");

const STORAGE_KEY = "BOOKSHELF_APP";

let books = [];
let filteredBooks = [];
let toastTimeout;

const DUMMY_BOOKS = [
  {
    id: 1,
    title: "Judul Buku 1",
    author: "Penulis 1",
    year: 2021,
    isComplete: false,
    image: "https://via.placeholder.com/60x80?text=Buku+1",
  },
  {
    id: 2,
    title: "Judul Buku 2",
    author: "Penulis 2",
    year: 2022,
    isComplete: true,
    image: "https://via.placeholder.com/60x80?text=Buku+2",
  },
];

function loadBooks() {
  const storedBooks = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (storedBooks) {
    books = storedBooks;
  } else {
    books = [...DUMMY_BOOKS];
    saveBooks();
  }
  applyFilters();
  renderBooks();
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function renderBooks() {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookCard = generateBookCard(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookCard);
    } else {
      incompleteBookList.appendChild(bookCard);
    }
  });
}

function generateBookCard(book) {
  const bookItem = document.createElement("div");
  bookItem.classList.add("book-item");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");

  bookItem.innerHTML = `
    <img src="${book.image}" alt="Buku" />
    <div>
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div class="actions">
        <button class="complete" data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum Dibaca" : "Selesai Dibaca"}
        </button>
        <button class="delete" data-testid="bookItemDeleteButton">Hapus</button>
        <button class="edit">Edit</button>
      </div>
    </div>
  `;

  bookItem
    .querySelector(".complete")
    .addEventListener("click", () => toggleBookCompletion(book.id));
  bookItem
    .querySelector(".delete")
    .addEventListener("click", () => deleteBook(book.id));
  bookItem
    .querySelector(".edit")
    .addEventListener("click", () => editBook(book.id));

  return bookItem;
}

function addBook(book) {
  books.push(book);
  saveBooks();
  applyFilters();
  renderBooks();
  showToast("Buku berhasil ditambahkan!");
}

function toggleBookCompletion(id) {
  const book = books.find((b) => b.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    updateBooks("Buku berhasil dipindahkan!");
  }
}

function deleteBook(id) {
  books = books.filter((b) => b.id !== id);
  updateBooks("Buku berhasil dihapus!");
}

function editBook(id) {
  const book = books.find((b) => b.id === id);
  if (book) {
    bookForm["bookFormTitle"].value = book.title;
    bookForm["bookFormAuthor"].value = book.author;
    bookForm["bookFormYear"].value = book.year;
    bookForm["bookFormIsComplete"].checked = book.isComplete;

    bookForm.dataset.editing = id;
    bookForm.querySelector("button[type='submit']").textContent = "Update Buku";
  }
}

function updateBooks(message) {
  saveBooks();
  applyFilters();
  renderBooks();
  showToast(message);
}

function showToast(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 3000);
}

function applyFilters() {
  const searchQuery = searchBookTitle.value.trim().toLowerCase();
  const filterValue = filter.value;

  filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery);
    const matchesFilter =
      filterValue === "all" ||
      (filterValue === "complete" && book.isComplete) ||
      (filterValue === "incomplete" && !book.isComplete);
    return matchesSearch && matchesFilter;
  });
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  applyFilters();
  renderBooks();
});

filter.addEventListener("change", () => {
  applyFilters();
  renderBooks();
});

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = bookForm["bookFormTitle"].value.trim();
  const author = bookForm["bookFormAuthor"].value.trim();
  const year = parseInt(bookForm["bookFormYear"].value.trim(), 10);
  const isComplete = bookForm["bookFormIsComplete"].checked;

  if (title && author && year) {
    const editingId = bookForm.dataset.editing;
    if (editingId) {
      const book = books.find((b) => b.id === parseInt(editingId, 10));
      if (book) {
        Object.assign(book, { title, author, year, isComplete });
        updateBooks("Buku berhasil diperbarui!");
      }
      delete bookForm.dataset.editing;
      bookForm.querySelector("button[type='submit']").textContent =
        "Simpan Buku";
    } else {
      addBook({
        id: Date.now(),
        title,
        author,
        year,
        isComplete,
        image: "https://via.placeholder.com/60x80?text=New+Buku",
      });
    }

    bookForm.reset();
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = themeToggle.querySelector("i");
  icon.className = document.body.classList.contains("dark")
    ? "fas fa-sun"
    : "fas fa-moon";
});

loadBooks();
