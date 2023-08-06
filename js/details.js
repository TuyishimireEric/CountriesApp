const detailsPage = document.querySelector(".detailsPage");
const detailsHeader = document.querySelector(".details-header");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const root = document.documentElement;

const allCountries = JSON.parse(localStorage.getItem("data")) || "";
let mode = localStorage.getItem("mode")||"light";

const displayHeader=()=>{
    detailsHeader.innerHTML = `
        <div class="back">
            <img src=${mode=="light"? "./images/back.png": "./images/backD.png"}>
            <p>back</p>
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
    
    document.querySelector(".back").addEventListener("click",(e)=>{
        e.preventDefault();
        window.location.href="./index.html";
    });
       
}

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

const findName = (spelling)=>{
    const foundCountry = allCountries.filter(count=> count.spelling.includes(spelling));
    return foundCountry[0];
}

const displayDetails =()=>{
    if(allCountries == "" || !id){
        window.location.href="./index.html";
    }
    let country = allCountries.filter(country=> country.id == id)[0];
    const languages = Object.values(country.languages).join(", "); 
    const borders = country.borders.map((item)=>findName(item));
    let countryBorders = '';

    borders.forEach(country=>{
        const tag = `<li id=${country.id} class="borders">${country.name}</li>
        `;
        countryBorders += tag;
    })

    detailsPage.innerHTML = `
        <div class="details-container">
            <img src=${country.flag}>
            <div class="details-info">
                <h2>${country.name}</h2>
                <p>Capital:   <span>${country.capital}</span></p>
                <p>Population:   <span>${country.population.toLocaleString()}</span></p>
                <p>Area:   <span>${country.area.toLocaleString()} km<sup>2</sup></span></p>  
                <p>Language:   <span>${languages}</span></p>  
                <p>Region:   <span>${country.region}</span></p>  
                ${countryBorders!=""? 
                `<div>
                    <p>Borders:</p> 
                    <ul class="allborders">${countryBorders}</ul>
                </div>`: ""
                }
            </div>
        </div>
        `;

        const allborders = document.querySelector(".allborders");
    
        if(allborders){
                allborders.addEventListener("click", (e)=>{
                window.location.href = "./details.html" +`?id=${e.target.id}`;
            })
        }
    
}

getTheme();
displayHeader();
displayDetails();
