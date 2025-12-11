const categoryContainer = document.getElementById("categoryContainer");
const cardContainer = document.getElementById("cardContainer");
const historyContainer = document.getElementById("historyContainer");
let bookMark = [];
const viewDetailsmodal = document.getElementById("viewDetailsmodal");
const modalContainer = document.getElementById("modalContainer");

const popularNewsContainer = document.getElementById("popularNewsContainer");
// Categories Load function **Step-1**
const loadCategories = async () => {
  try {
    const res = await fetch("https://news-api-fs.vercel.app/api/categories");
    const data = await res.json();
    // console.log(data.categories);

    displayCategories(data.categories); //parameter given

    document.querySelector("li").classList.remove("border-transparent");
    document.querySelector("li").classList.add("border-red-700");
  } catch (error) {
    showError();
  }
};
// Displaying all the categories **Step-2**

const displayCategories = (categories) => {
  categories.forEach((category) => {
    categoryContainer.innerHTML += `<li id=${category.id}
          class="border-b-4 border-transparent hover:border-b-4 hover:border-red-700 pt-[12px] pb-[4px] text-[17px] px-2 cursor-pointer"

        >
          ${category.title}
        </li>
  `;
  });
};
// Click function on each category by event delegation

categoryContainer.addEventListener("click", (e) => {
  if (e.target.localName === "li") {
    showLoading(); //loading function
    const id = e.target.id;
    const allli = document.querySelectorAll("#categoryContainer li");
    for (let li of allli) {
      li.classList.remove("border-red-700", "border-transparent", "border-b-4");
    }
    document.getElementById(id).classList.add("border-red-700", "border-b-4");
    document.getElementById(
      "categoryName"
    ).innerHTML = `<div class="mb-7 text-3xl font-bold max-w-7xl mx-auto">${e.target.innerText}</div> 
    `;
    loadNewsOnCategory(id); //Given id to fetch each category news
  }
});

const loadNewsOnCategory = async (id) => {
  try {
    const res = await fetch(
      `https://news-api-fs.vercel.app/api/categories/${id}`
    );
    const data = await res.json();

    displayNews(data.articles); //Display each category news
  } catch (error) {
    showError();
  }
};

const displayNews = (articles) => {
  if (articles.length == 0) {
    showEmpty();
    return;
  }
  cardContainer.innerHTML = "";
  articles.forEach((article) => {
    cardContainer.innerHTML += `
    <div class="border-t-2 border-gray-200   md:border-t-0  md:w-auto mx-auto flex justify-between items-center gap-5 md:flex-col md:gap-0">
    <div class=""><img class="w-[200px] md:w-auto" src="${
      article.image.srcset[8].url
    }" alt=""> </div>
  <div id="${
    article.id
  }" class="flex-1"><h1 class="md:text-xl my-3 font-semibold">${
      article.title
    }</h1>
  <p class="">${article.time ? article.time : "Unavailable"}</p>

<div class="flex justify-between mt-2">
<button class="text-xs font-semibold rounded-md bg-red-700 px-3 py-1 text-white">Bookmark</button>
<button class="text-xs font-semibold rounded-md bg-red-700 px-3 py-1 text-white">Details</button>
</div> </div>
  

</div>`;
  });
};

//Bookmark button click function

document.getElementById("cardContainer").addEventListener("click", (e) => {
  if (e.target.innerText === "Bookmark") {
    const id = e.target.parentNode.parentNode.id;
    const title = e.target.parentNode.parentNode.children[0].innerText;
    const exists = bookMark.some((item) => item.id === id);
    if (exists) {
      return;
    } else {
      bookMark.push({
        id: id,
        title: title,
      });
    }

    historyContainer.innerHTML = "";
    historyView(bookMark);
  }
  if (e.target.innerText === "Details") {
    handleDetails(e);
  }
});
const handleDetails = (e) => {
  const id = e.target.parentNode.parentNode.id;

  const fetchDetails = async () => {
    try {
      const res = await fetch(`https://news-api-fs.vercel.app/api/news/${id}`);
      const data = await res.json();

      displayDetails(data.article);
    } catch (error) {}
  };

  fetchDetails();
};

const displayDetails = (articles) => {
  if (!articles) {
    modalContainer.innerHTML = `
    No details found`;
    viewDetailsmodal.showModal();
    return;
  }
  modalContainer.innerHTML = `

<p class="font-semibold mb-3 text-xl">${articles.title}</p>
<img src="${articles.images[3].url}"/>
<p>${articles.timestamp}</p>
<p class="mt-3 text-gray-500 text-justify">${articles.content.join("")} </p>
`;
  viewDetailsmodal.showModal();
};

const historyView = (bookMark) => {
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("count").innerText = `${bookMark.length}`;
  for (let book of bookMark) {
    historyContainer.innerHTML += `
      <div id="${book.id}" class="mt-6">
      <p> ${book.title}...</p>
      <div class="flex justify-between items-center"><p>${time}</p>
     
      <button class="text-xs border-red-200 px-3 py-1 border-2">Delete</button>
       </div>
      
      </div>
      `;
  }
};

historyContainer.addEventListener("click", (e) => {
  if (e.target.innerText === "Delete") {
    const newArr = [];

    for (let book of bookMark) {
      if (book.id !== e.target.parentNode.parentNode.id) {
        newArr.push(book);
      }
    }
    bookMark = [...newArr];
    historyContainer.innerHTML = "";

    historyView(bookMark);
  }
});
const showLoading = () => {
  cardContainer.innerHTML = `
  <span class="loading loading-bars loading-xl mx-auto"></span>
  `;
};
const showError = () => {
  cardContainer.innerHTML = `
  <span class=" mx-auto">Something went wrong</span>
  `;
};
const showEmpty = () => {
  cardContainer.innerHTML = `
  <span class=" mx-auto">No news found in this category</span>
  `;
};

// fetch popular news

const popularNewsFetch = async () => {
  try {
    const res = await fetch("https://news-api-fs.vercel.app/api/popular");
    const data = await res.json();
    displayPopularNews(data.articles);
  } catch (error) {
    console.log(error);
  }
};
const displayPopularNews = (articles) => {
  for (let article of articles) {
    popularNewsContainer.innerHTML += `
<div>
<p class="text-2xl font-semibold">
  <a href="${article.link}" class="text-blue-600 hover:underline">
    ${article.title}
  </a>
</p> <p>${article.scrapedAt}</p>
</div>
`;
  }
};
popularNewsFetch();
loadNewsOnCategory("main");
loadCategories();
