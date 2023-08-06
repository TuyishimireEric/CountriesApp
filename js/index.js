const Container=document.querySelector(".container");
const search = document.querySelector("#search");
const regionFilter = document.querySelector("#regionFilter");
const clearButton = document.querySelector("#clearButton");
const Borders = document.querySelector(".allborders");
const root = document.documentElement;
const homeHeader = document.querySelector(".home-header");
let mode = localStorage.getItem("mode")||"light";
let allCountries;

let filterBy = {
    name:"",
    region:""
};


const dataStore = () =>{
    localStorage.setItem("data", JSON.stringify(allCountries));
}

const homeDisplay=(countries)=>{
    let display = "";
    countries.forEach(country=>{
        display += `
            <div class="country" id=${country.id}>
                <img src=${country.flag} alt="flag">
                <div class="country_info">
                    <h2>${country.name}</h2>
                    <p>Capital: <span>${country.capital}</span></p>
                    <p>Population: <span>${country.population}</span></p>
                    <p>Region: <span>${country.region}</span></p>
                </div>
            </div>
        `;
    })
    Container.innerHTML = display;
}

const searchCountry=()=>{
    const filtered = allCountries.filter((country)=>country.name.toLowerCase().includes(filterBy.name) && country.region.toLowerCase().includes(filterBy.region)  );
    homeDisplay(filtered);   

}

clearButton.addEventListener("click", (e)=>{
    e.preventDefault();
    filterBy.name = "";
    filterBy.region = "";
    search.value ="";
    regionFilter.value = "";
    homeDisplay(allCountries);
})

regionFilter.addEventListener("change", (e)=>{
    e.preventDefault();
    filterBy.region = regionFilter.value.toLowerCase();
    
    searchCountry();
});


search.addEventListener("input",(e)=> {
    e.preventDefault();
    filterBy.name =  search.value.trim().toLowerCase();
    searchCountry();
})


const fetchData = async()=>{
    const Response = await fetch("https://restcountries.com/v3.1/all");
    const data = await Response.json();
    let index = 0;
    const neededData = data.map(country=>{
        
        index++;
        return {
            id: index,
            flag: country.flags.png,
            continents: country.continents,
            capital: country.capital,
            spelling: country.cca3,
            area: country.area,
            capitalInfo: country.capitalInfo,
            currencies: country.currencies,
            name: country.name.common,
            languages: country.languages,
            population: country.population,
            region: country.region,
            borders: country.borders || []
        }
    });

    console.log(data[190]);
    allCountries = neededData.sort((a, b)=> a.name.localeCompare(b.name));
    dataStore();
    homeDisplay(allCountries);
}

Container.addEventListener("click", (e)=>{
    e.preventDefault();
    const selected  = e.target.closest(".country");
    if(!selected)return;

    window.open("./details.html" +`?id=${selected.id}`, "_blank");
   
})

const getTheme=()=>{
    mode = localStorage.getItem("mode")||"light";
    if(mode!="light"){
        root.style.setProperty("--first-color", "hsl(209, 23%, 22%)");
        root.style.setProperty("--second-color", "hsl(207, 26%, 17%)");
        root.style.setProperty("--text-color","hsl(0, 0%, 100%)");
        root.style.setProperty("--border-color", "hsl(0, 0%, 100%");
    }else {
        root.style.setProperty("--first-color", "#efeeec");
        root.style.setProperty("--second-color", "#fff");
        root.style.setProperty("--text-color","#000");
        root.style.setProperty("--border-color", "rgba(99, 99, 99, 0.2);");
    }
}


const displayHeader=()=>{
    homeHeader.innerHTML = `
        <div class="title">
            <img src=${mode=="light"? "./images/icon.png": "./images/icon.png"}>
            <h1>Where in the world?</h1>
        </div>
        <div class="mode">
            <img src=${mode=="light"? "./images/dark.png": "./images/light.png"}>
            <p class="dark">${mode=="light"? "Dark Mode": "Light Mode"}</p>
        </div>
    `;
    document.querySelector(".mode").addEventListener("click", (e)=>{
        e.preventDefault();
        if(mode=="light"){
            mode="dark";
        }else {
            mode = "light";
        }
        localStorage.setItem("mode", `${mode}`);
        getTheme();
        displayHeader();
    });
    
    document.querySelector(".title").addEventListener("click",(e)=>{
        e.preventDefault();
        window.location.href="./index.html";
    });
       
}

displayHeader();
getTheme();
fetchData();