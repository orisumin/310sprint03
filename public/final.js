let pokemons = [];
const searchBtn = document.querySelector("#searchBtn");
const filterOpener = document.querySelector("#dropdownBtn");

const filters = document.querySelector("#filters");

const bug = document.querySelector("#elementalType1");
const dark = document.querySelector("#elementalType2");
const dragon = document.querySelector("#elementalType3");
const electric = document.querySelector("#elementalType4");
const fairy = document.querySelector("#elementalType5");
const fight = document.querySelector("#elementalType6");
const fire = document.querySelector("#elementalType7");
const flying = document.querySelector("#elementalType8");
const ghost = document.querySelector("#elementalType9");
const grass = document.querySelector("#elementalType10");
const ground = document.querySelector("#elementalType11");
const ice = document.querySelector("#elementalType12");
const normal = document.querySelector("#elementalType13");
const poision = document.querySelector("#elementalType14");
const psychic = document.querySelector("#elementalType15");
const rock = document.querySelector("#elementalType16");
const steel = document.querySelector("#elementalType17");
const water = document.querySelector("#elementalType18");
const typeList = [bug, dark, dragon, electric, fairy, fight, fire, flying, ghost, grass, ground, ice, normal, poision, psychic, rock, steel, water];

const applyBtn = document.querySelector(".apply");
const cardsContainer = document.querySelector("#cards-container");

const searchForm = document.querySelector("#searchForm");

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    search();
});

filterOpener.addEventListener('click',()=>{
    const ifOpen = filters.hidden == true;
    filters.hidden = !ifOpen;
    if (filters.hidden == true){
        filterOpener.innerHTML =`filters ⮟`;
    }
    else{
        filterOpener.innerHTML =`filters ⮝`;
    }

});
applyBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    filterByTypes();
})


function search(){
    const userInput = document.querySelector("#searchBar").value.toLowerCase();

    const searchedList = pokemons.filter(pokemon =>{
        return pokemon.name.toLocaleLowerCase().includes(userInput) 
        || pokemon.category.toLocaleLowerCase().includes(userInput)
        || pokemon.ability.join(" ").toLocaleLowerCase().includes(userInput);
    });

    const sortedList = searchedList.sort(sortByName);
    displayCards(sortedList);
}
function filterByTypes(){
    const userInput = document.querySelector("#searchBar").value.toLowerCase();
    const checkedTypes = typeList.filter(type =>type.checked).map(type => type.value.toLocaleLowerCase());

    const searchedList = pokemons.filter(pokemon =>{
        return pokemon.name.toLocaleLowerCase().includes(userInput) 
        || pokemon.category.toLocaleLowerCase().includes(userInput)
        || pokemon.ability.join(" ").toLocaleLowerCase().includes(userInput);
    });
    const filteredList = searchedList.filter(pokemon => {
    if (checkedTypes.length === 0) {
        return true;
    }

    return pokemon.type.some(type => checkedTypes.includes(type.toLowerCase()));
});

    const sortedList = filteredList.sort(sortByName);
    displayCards(sortedList);
}
function displayType(typelist){
    let typeString = ``;
    typelist.forEach(type => {
        typeString +=
        `<div class="PKMtype">
            <p style="color: ${getTypeColorCode(type)};"><b>${type.toUpperCase()}</b> 
            </p>
            <img src="img/${type}.png">
        </div>`;
    });
    return typeString;
}
function getTypeColorCode(typeName){
    switch (typeName){
        case "bug":
            return `#6ba001`;
        case "dark":
            return `#ffffff`;
        case "dragon":
            return `#006cc5`;
        case "electric":
            return `#c7a200`;
        case "fairy":
            return `#d43dca`;
        case "fight":
            return `#cf3e69`;
        case "fire":
            return `#fe7e22`;
        case "flying":
            return `#5572b0`;
        case "ghost":
            return `#5268ac`;
        case "grass":
            return `#1c940e`;
        case "ground":
            return `#da7744`;
        case "ice":
            return `#249383`;
        case "normal":
            return `#ffffff`;
        case "poison":
            return `#ab6ac9`;
        case "psychic":
            return `#d25256`;
        case "rock":
            return `#877b57`;
        case "steel":
            return `#437385`;
        case "water":
            return `#4086d1`;
        default:
            return `#ffffff`;
    }
}
function displayAbility(list){
    let abilityString = ``;
    list.forEach(ability => {
        if(ability != list[list.length -1]){
            abilityString += `${ability}, `; 
        }else{
            abilityString += `${ability}`;
        }
    });
    return abilityString;
}

function makeElement(tag, className, text = "") {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

function displayCards(list) {
    // Remove the previous cards.
    cardsContainer.replaceChildren();

    if (list.length === 0) {
        cardsContainer.textContent = "No Pokémon found.";
        return;
    }

    list.forEach(pokemon => {
        const card = makeElement("div", "card");
        const imagePart = makeElement("div", "img-part");

        // Only build image paths from simple, valid names.
        if (
            typeof pokemon.name === "string" &&
            /^[A-Za-z0-9_-]+$/.test(pokemon.name)
        ) {
            const image = makeElement("img", "pokemon");
            image.src = `img/${pokemon.name}.webp`;
            image.alt = `${pokemon.name} image`;
            imagePart.append(image);
        }

        // Build the type labels and icons.
        const types = Array.isArray(pokemon.type)
            ? pokemon.type
            : [];

        types.forEach(type => {
            // Only allow types listed in your existing filter checkboxes.
            const isKnownType = typeList.some(checkbox => {
                return checkbox.value === type;
            });

            if (!isKnownType) {
                return;
            }

            const typeBox = makeElement("div", "PKMtype");
            const typeLabel = makeElement("p", "");
            const boldText = makeElement("b", "", type.toUpperCase());

            typeLabel.style.color = getTypeColorCode(type);
            typeLabel.append(boldText);

            const typeIcon = makeElement("img", "");
            typeIcon.src = `img/${type}.png`;
            typeIcon.alt = "";

            typeBox.append(typeLabel, typeIcon);
            imagePart.append(typeBox);
        });

        // Build the text section.
        const description = makeElement("div", "description");

        const name = makeElement("p", "name", pokemon.name);
        const category = makeElement("p", "category", pokemon.category);

        const abilities = Array.isArray(pokemon.ability)
            ? pokemon.ability.join(", ")
            : "";

        const details = makeElement("p", "");

        details.append(
            `Height: ${pokemon.height}m`,
            document.createElement("br"),
            `Weight: ${pokemon.weight}kg`,
            document.createElement("br"),
            `Ability: ${abilities}`
        );

        description.append(name, category, details);
        card.append(imagePart, description);
        cardsContainer.append(card);
    });
}
function sortByName(a,b){
    if (a.name > b.name){
        return 1;
    }else if (a.name < b.name){
        return -1;
    }
    return 0;
}

async function loadPokemons() {
    cardsContainer.textContent = "Loading Pokémon...";

    try {
        const response = await fetch("/api/Pokemons");

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Expected a Pokémon array");
        }

        pokemons = data.map(pokemon => {
            const abilities =
                pokemon.ability ?? [];

            return {
                ...pokemon,
                ability: Array.isArray(abilities)
                    ? abilities
                    : [String(abilities)]
            };
        });

        if (pokemons.length === 0) {
            cardsContainer.textContent = "No Pokémon found.";
            return;
        }

        displayCards([...pokemons].sort(sortByName));
    } catch (error) {
        console.error("Failed to load Pokémon:", error);
        cardsContainer.textContent =
            "Could not load Pokémon. Please refresh to try again.";
    }
}

loadPokemons();