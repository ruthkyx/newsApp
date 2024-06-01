// const NewsAPI = require('newsapi');
// const newsapi = new NewsAPI('9d346bac44dc406da10bcd8e967aa74d');
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them

// https://restcountries.com/v3.1/alpha"

function saveUserInput() {
    let input = document.getElementById("userInputName").value;
    sessionStorage.setItem("userInputName", input);
}
// this loads user input from session storage
function loadUserInput() {
    let input = sessionStorage.getItem("userInputName");
    if (input) {
        document.getElementById("helloName").textContent = `Hello ${input}!`;
    }
}
let inputField = document.getElementById("userInputName"); // ref to input field
inputField.addEventListener("input", saveUserInput);

document.getElementById('submitNameBtn').onclick = function () {
    loadUserInput();
}
window.addEventListener("load", loadUserInput);

const apiKey = "9d346bac44dc406da10bcd8e967aa74d";
const fetchNews = async (page, q) => {
    console.log(`fetching news for ${q}, page number ${page}`);
    var url = 'https://newsapi.org/v2/everything?' +
        'q=' + q +
        '&from=2024-05-31&' +
        'pageSize=20&' +
        'language=en&' +
        'page=' + page +
        'sortBy=popularity&' +
        'apiKey=' + apiKey;

    var req = new Request(url);

    let a = await fetch(req)
    let response = await a.json()
    // console.log(JSON.stringify(response))

    let str = "";
    for (let item of response.articles) {
        str = str + ` <div class="card my-4 mx-2" style="width: 18rem;">
        <img src="${item.urlToImage}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">${item.description}</p>
            <a href="${item.url}" target= "_blank" class="btn btn-primary">Link to article</a>
        </div>
        </div>`
    }
    document.querySelector(".content").innerHTML = str;
}
let currentQuery = "sports";
let currentPage = 1;

fetchNews(1, currentQuery);

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let query = searchInput.value;
    currentQuery = query;
    fetchNews(1, query);
});
prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage = currentPage - 1;
        let query = searchInput.value;
        fetchNews(currentPage, currentQuery);
    }
});
nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentPage = currentPage + 1;
    let query = searchInput.value;
    fetchNews(currentPage, currentQuery);
});

// dropdown by country 

// fetch('https://newsapi.org/v2/top-headlines')

async function fetchCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();
    return countries;
}
fetchCountries().then(countries => {
    displayCountries(countries);
});

function displayCountries(countries) {
    const dropdown = document.getElementById('country-dropdown');
    countries.forEach(country => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = country.name.common;
        link.href = '#';
        link.addEventListener('click', async () => {
            const news = await fetchNews(country.cca2.toLowerCase());
            displayNews(news.articles);
        });
        li.appendChild(link);
        dropdown.appendChild(li);
    });
}

// GET https://newsapi.org/v2/top-headlines/sources?country=usapiKey=API_KEY
async function countryNews() {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`);
    const news = await response.json();
    return news;
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    articles.forEach(article => {
        const div = document.createElement('div');
        div.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.description || ''}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      `;
        newsContainer.appendChild(div);
    });
}

// dropdown by category 

const categoryDropdown = document.getElementById('category-dropdown');
categoryDropdown.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        const category = e.target.getAttribute('data-category');
        fetchNewsArticles(category);
    }
});

function fetchNewsArticles(category) {
    const url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&category=${category}`;
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Process the data and display the news articles
        console.log(data);
        displayNewsArticles(data.articles);
      })
      .catch((error) => {
        console.error(error);
      });
  }

function displayNewsArticles(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    articles.forEach((article) => {
        const div = document.createElement('div');
        div.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.description || ''}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      `;
        newsContainer.appendChild(div);
    });
}