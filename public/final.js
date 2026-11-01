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
            // Accept only local .webp paths from the image field.
            const imagePath = typeof pokemon.img === "string" &&
                /^img\/[A-Za-z0-9_-]+\.webp$/.test(pokemon.img) &&
                !/[\r\n]/.test(pokemon.img)
                    ? pokemon.img
                    : `img/${pokemon.name}.webp`;

            image.src = imagePath;
            image.alt = `${pokemon.name} image`;
            image.addEventListener("error", () => {
                image.replaceWith(makeElement("p", "", "Image unavailable"));
            }, { once: true });
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

        // Create a Delete button for this Pokémon.
        const deleteButton = makeElement(
            "button",
            "delete-pokemon-button",
            "Delete"
        );

        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            openDeleteDialog(pokemon);
        });

        description.append(deleteButton);
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

// Popup controls are initialized before loading records.
const addPokemonButton = document.querySelector("#addPokemonBtn");
const addDialog = document.querySelector("#addPokemonDialog");
const addForm = document.querySelector("#addPokemonForm");
const submitPokemonButton = document.querySelector("#submitPokemon");
const cancelAddButton = document.querySelector("#cancelAddPokemon");
const closeAddButton = document.querySelector("#closeAddDialog");
const addError = document.querySelector("#addPokemonError");
const primaryType = document.querySelector("#pokemonType");
const secondaryType = document.querySelector("#pokemonSecondType");
const deleteDialog = document.querySelector("#deletePokemonDialog");
const deleteMessage = document.querySelector("#deletePokemonMessage");
const deleteError = document.querySelector("#deletePokemonError");
const confirmDeleteButton = document.querySelector("#confirmDeletePokemon");
const cancelDeleteButton = document.querySelector("#cancelDeletePokemon");
// Create a success message without requiring another HTML element.
const pageStatus = makeElement("p", "page-status");
pageStatus.setAttribute("role", "status");
pageStatus.style.color = "#fff585";
pageStatus.hidden = true;
document.querySelector("#search").before(pageStatus);

function announce(message) {
    pageStatus.hidden = false;
    pageStatus.textContent = message;
}
const abilityFields = document.querySelector("#abilityFields");
const addAbilityButton = document.querySelector("#addAbilityButton");
let abilityInputCounter = 0;

let pokemonToDelete = null;
let creatingPokemon = false;
let deletingPokemon = false;

// Reuse the same type values as the search filters.
typeList.forEach(checkbox => {
    const type = checkbox.value;
    const label = type === "fight" ? "Fighting" : type[0].toUpperCase() + type.slice(1);
    [primaryType, secondaryType].forEach(select => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = label;
        select.append(option);
    });
});

function showFormError(element, message) {
    element.textContent = message;
    element.hidden = !message;
}

function closeAddDialog() {
    if (!creatingPokemon) {
        addDialog.close();
    }
}

function updateAbilityControls() {
    const rows = abilityFields.querySelectorAll(".ability-row");
    rows.forEach((row, index) => {
        row.querySelector("label").textContent = `Ability ${index + 1}`;
        const removeButton = row.querySelector("button");
        removeButton.disabled = creatingPokemon || rows.length === 1;
        removeButton.setAttribute("aria-label", `Remove ability ${index + 1}`);
    });
    addAbilityButton.disabled = creatingPokemon || rows.length >= 10;
}

function addAbilityInput() {
    if (abilityFields.children.length >= 10 || creatingPokemon) {
        return;
    }
    const row = makeElement("div", "ability-row");
    const field = makeElement("div", "form-field");
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.id = `abilityInput${++abilityInputCounter}`;
    input.name = "ability";
    input.type = "text";
    input.required = true;
    input.maxLength = 100;
    label.htmlFor = input.id;
    field.append(label, input);

    const removeButton = makeElement("button", "ability-remove", "−");
    removeButton.type = "button";
    removeButton.addEventListener("click", () => {
        if (abilityFields.children.length <= 1 || creatingPokemon) {
            return;
        }
        row.remove();
        updateAbilityControls();
        abilityFields.querySelector("input").focus();
    });
    row.append(field, removeButton);
    abilityFields.append(row);
    updateAbilityControls();
    return input;
}

addAbilityButton.addEventListener("click", () => {
    const input = addAbilityInput();
    if (input) {
        input.focus();
    }
});

addPokemonButton.addEventListener("click", () => {
    addForm.reset();
    abilityFields.replaceChildren();
    addAbilityInput();
    showFormError(addError, "");
    addDialog.showModal();
});

closeAddButton.addEventListener("click", closeAddDialog);
cancelAddButton.addEventListener("click", closeAddDialog);
addDialog.addEventListener("cancel", event => {
    if (creatingPokemon) {
        event.preventDefault();
    }
});

function setCreateBusy(busy) {
    creatingPokemon = busy;
    addForm.querySelectorAll("input, select, button").forEach(control => {
        control.disabled = busy;
    });
    closeAddButton.disabled = busy;
    updateAbilityControls();
    addForm.setAttribute("aria-busy", String(busy));
    submitPokemonButton.textContent = busy ? "Adding…" : "Add";
}

async function requestJson(url, options = {}) {
    const response = await fetch(url, options);
    let result;

    try {
        result = await response.json();
    } catch {
        throw new Error(`The server returned an unreadable response (${response.status}). Refresh before trying again.`);
    }

    if (!response.ok) {
        throw new Error(result.error || `Request failed (${response.status}).`);
    }

    return result;
}

addForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (creatingPokemon || !addForm.reportValidity()) {
        return;
    }

    showFormError(addError, "");

    const formData = new FormData(addForm);
    const abilities = formData.getAll("ability").map(ability => ability.trim());
    const types = [primaryType.value];
    if (secondaryType.value) {
        types.push(secondaryType.value);
    }

    const newPokemon = {
        _id: Number(formData.get("_id")),
        name: formData.get("name").trim(),
        type: types,
        category: formData.get("category").trim(),
        height: Number(formData.get("height")),
        weight: Number(formData.get("weight")),
        ability: abilities
    };

    const imagePath = formData.get("img").trim();
    if (imagePath) {
        newPokemon.img = imagePath;
    }

    if (!Number.isSafeInteger(newPokemon._id) || newPokemon._id <= 0) {
        showFormError(addError, "Enter a positive whole number for the Pokédex number.");
        return;
    }
    if (types.length === 2 && types[0] === types[1]) {
        showFormError(addError, "Choose two different types, or leave the secondary type as None.");
        return;
    }
    if (!newPokemon.category) {
        showFormError(addError, "Enter a category.");
        return;
    }
    if (!Number.isFinite(newPokemon.height) || newPokemon.height <= 0 ||
        !Number.isFinite(newPokemon.weight) || newPokemon.weight <= 0) {
        showFormError(addError, "Height and weight must be numbers greater than zero.");
        return;
    }
    if (abilities.length < 1 || abilities.length > 10 || abilities.some(ability => ability.length === 0 || ability.length > 100)) {
        showFormError(addError, "Enter 1–10 abilities, with no more than 100 characters each.");
        return;
    }
    if (imagePath && (!/^img\/[A-Za-z0-9_-]+\.webp$/.test(imagePath) || /[\r\n]/.test(imagePath))) {
        showFormError(addError, "Use an image path like img/Fuecoco.webp, or leave it blank.");
        return;
    }

    setCreateBusy(true);
    try {
        const result = await requestJson("/api/Pokemons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPokemon)
        });

        if (!Number.isSafeInteger(result.id) || result.id !== newPokemon._id) {
            throw new Error("The server did not return the new Pokémon's ID. Refresh before trying again.");
        }

        pokemons.push({ ...newPokemon, _id: result.id });
        filterByTypes();
        announce(`${newPokemon.name} was added.`);
        addDialog.close();
        addForm.reset();
    } catch (error) {
        showFormError(addError, error.message || "Could not add the Pokémon. Please try again.");
    } finally {
        setCreateBusy(false);
    }
});

function openDeleteDialog(pokemon) {
    if (deletingPokemon) {
        return;
    }
    pokemonToDelete = pokemon;
    deleteMessage.textContent = `Do you really want to delete ${pokemon.name}?`;
    showFormError(deleteError, "");
    deleteDialog.showModal();
}

cancelDeleteButton.addEventListener("click", () => {
    if (!deletingPokemon) {
        deleteDialog.close();
    }
});

deleteDialog.addEventListener("close", () => {
    pokemonToDelete = null;
});

deleteDialog.addEventListener("cancel", event => {
    if (deletingPokemon) {
        event.preventDefault();
    }
});

confirmDeleteButton.addEventListener("click", async () => {
    if (!pokemonToDelete || deletingPokemon) {
        return;
    }

    const pokemon = pokemonToDelete;
    deletingPokemon = true;
    confirmDeleteButton.disabled = true;
    cancelDeleteButton.disabled = true;
    confirmDeleteButton.textContent = "Deleting…";
    showFormError(deleteError, "");

    try {
        await requestJson(`/api/Pokemons/${encodeURIComponent(pokemon._id)}`, {
            method: "DELETE"
        });

        pokemons = pokemons.filter(item => item._id !== pokemon._id);
        filterByTypes();
        announce(`${pokemon.name} was deleted.`);
        deleteDialog.close();
    } catch (error) {
        showFormError(deleteError, error.message || "Could not delete the Pokémon. Please try again.");
    } finally {
        deletingPokemon = false;
        confirmDeleteButton.disabled = false;
        cancelDeleteButton.disabled = false;
        confirmDeleteButton.textContent = "Yes";
    }
});

loadPokemons();
