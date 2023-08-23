const imageWrapper = document.querySelector(".images");
const searchInput1 = document.querySelector(".search input");
const searchInput2 = document.querySelector(".navbar .search-box input");
const loadMoreBtn = document.querySelector(".gallery .load-more");
const lightbox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".btn-close");

// API key, pagination, and searchTerm variables
const apiKey = "mgQrbr6Roh27RN0tRTWFRdnAVNJjoVVyqlXr7xobP-E";
const perPage = 25;
let currentPage = 1;
let searchTerm = null;

//download image 
const downloadImg = (imgUrl) => {
  fetch(imgUrl)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();

      // Create a notification element
      const notification = document.createElement("div");
      notification.textContent = "Image downloaded successfully!";
      // Style the notification element as desired
      notification.style.background = "white";
      notification.style.color = "black";
      notification.style.padding = "15px";
      notification.style.borderLeft = "7px solid green";
      notification.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";
      notification.style.borderRadius = "6px";
      notification.style.position = "fixed";
      notification.style.bottom = "20px";
      notification.style.right = "20px";
      notification.style.zIndex = "9999";


      // Append the notification element to the document body
      document.body.appendChild(notification);

      // Remove the notification after a certain time (e.g., 3 seconds)
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    })
    .catch(() => {
      // Create an error notification element
      const errorNotification = document.createElement("div");
      errorNotification.textContent = "Failed to download image!";
      // Style the error notification element as desired
      errorNotification.style.background = "white";
      errorNotification.style.color = "black";
      errorNotification.style.padding = "15px";
      errorNotification.style.borderLeft = "7px solid red";
      errorNotification.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";
      errorNotification.style.borderRadius = "6px";
      errorNotification.style.position = "fixed";
      errorNotification.style.bottom = "20px";
      errorNotification.style.right = "20px";
      errorNotification.style.zIndex = "9999";
      errorNotification.style.transition = "right 0.3s ease-in";
      // Append the error notification element to the document body
      document.body.appendChild(errorNotification);

      // Remove the error notification after a certain time (e.g., 3 seconds)
      setTimeout(() => {
        document.body.removeChild(errorNotification);
      }, 3000);
    });
};

const showLightbox = (name, img) => {
  // Showing lightbox and setting img source, name and button attribute
  lightbox.querySelector("img").src = img;
  lightbox.querySelector("span").innerText = name;
  lightbox.classList.add("show");
  document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
  lightbox.classList.remove("show");
  document.body.style.overflow = "auto";
};

const generateHTML = (images) => {
  // Making li of all fetched images and adding them to the existing image wrapper
  imageWrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card">
            <img onclick="showLightbox('${img.user.name}', '${img.urls.regular}')"  src="${img.urls.regular}" alt="img">
            <div class="details">
                <div class="photographer">
                <i class="fa-solid fa-camera"></i>
                    <span>${img.user.name}</span>
                </div>
                <button onclick="downloadImg('${img.urls.regular}')" class="btn">
                <i class="fa-solid fa-download"></i>
                </button>
            </div>
        </li>`
    )
    .join("");
};


const getImages = async (apiURL) => {
  try {

    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    const response = await fetch(apiURL, {
      headers: { Authorization: `Client-ID ${apiKey}` },
    });
    const data = await response.json();
    console.log(data);

    // Check the structure of the data object and extract the array of images
    const images = Array.isArray(data) ? data : data.results;

    // Add searchInput.blur() to blur the search input field
    searchInput1.blur();
    searchInput2.blur();

    generateHTML(images);

    loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
  } catch (error) {
    console.error(error);

    loadMoreBtn.innerText = "Load More";
    loadMoreBtn.classList.remove("disabled");
  }
};
//load more
const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.unsplash.com/photos/random?count=${perPage}&client_id=${apiKey}`;
  apiURL = searchTerm
    ? `https://api.unsplash.com/search/photos?page=${currentPage}&query=${encodeURIComponent(searchTerm)}&client_id=${apiKey}`
    : `${apiURL}&page=${currentPage}`;
  getImages(apiURL);
};
//search
const loadSearchImages = (e) => {
  // If the search input is empty, set the search term to null and return from here
  if (e.target.value === "") return;
  // If pressed key is Enter, update the current page, search term & call the getImages
  if (e.key === "Enter") {
    currentPage = 1;
    const searchTerm = e.target.value;
    imageWrapper.innerHTML = "";
    const apiURL = `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(
      searchTerm
    )}&client_id=${apiKey}`;
    getImages(apiURL);
  }
};

// Modified the initial load of images to use the random endpoint
getImages(
  `https://api.unsplash.com/photos/random?count=${perPage}&client_id=${apiKey}`
);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput1.addEventListener("keyup", loadSearchImages);
searchInput2.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
