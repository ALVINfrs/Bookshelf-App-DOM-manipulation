const bookForm = document.getElementById("bookForm");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const filter = document.getElementById("filter");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");

const STORAGE_KEY = "BOOKSHELF_APP";

let books = [];

function loadBooks() {
  const data = localStorage.getItem(STORAGE_KEY);
  books = data ? JSON.parse(data) : [];
  renderBooks();
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function generateBookCard(book) {
  const bookItem = document.createElement("div");
  bookItem.classList.add("book-item");
  bookItem.dataset.bookid = book.id;

  bookItem.innerHTML = `
    <img src="https://picsum.photos/60/80?random=1" alt="Buku"  ${
      book.title
    }" />
    <div>
      <h3>${book.title}</h3>
      <p>Penulis: ${book.author}</p>
      <p>Tahun: ${book.year}</p>
      <div class="actions">
        <button class="complete"><i class="fas fa-check"></i> ${
          book.isComplete ? "Belum Dibaca" : "Selesai Dibaca"
        }</button>
        <button class="delete"><i class="fas fa-trash"></i> Hapus</button>
      </div>
    </div>
  `;

  const completeButton = bookItem.querySelector(".complete");
  completeButton.addEventListener("click", () => toggleBookCompletion(book.id));

  const deleteButton = bookItem.querySelector(".delete");
  deleteButton.addEventListener("click", () => deleteBook(book.id));

  return bookItem;
}

function renderBooks() {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  const searchQuery = searchInput.value.trim().toLowerCase();
  const filteredBooks = books.filter((book) => {
    if (filter.value === "incomplete" && book.isComplete) return false;
    if (filter.value === "complete" && !book.isComplete) return false;
    if (searchQuery && !book.title.toLowerCase().includes(searchQuery))
      return false;
    return true;
  });

  filteredBooks.forEach((book) => {
    const bookCard = generateBookCard(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookCard);
    } else {
      incompleteBookList.appendChild(bookCard);
    }
  });
}

function addBook(book) {
  books.push(book);
  saveBooks();
  renderBooks();
  showToast("Buku berhasil ditambahkan!");
}

function toggleBookCompletion(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks();
    showToast("Buku berhasil dipindahkan!");
  }
}

function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  saveBooks();
  renderBooks();
  showToast("Buku berhasil dihapus!");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("bookFormTitle").value.trim();
  const author = document.getElementById("bookFormAuthor").value.trim();
  const year = parseInt(
    document.getElementById("bookFormYear").value.trim(),
    10
  );
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (title && author && year) {
    const newBook = {
      id: Date.now(),
      title,
      author,
      year,
      isComplete,
    };
    addBook(newBook);
    bookForm.reset();
  }
});

filter.addEventListener("change", renderBooks);

searchInput.addEventListener("input", renderBooks);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = themeToggle.querySelector("i");
  if (document.body.classList.contains("dark")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
});

loadBooks();
