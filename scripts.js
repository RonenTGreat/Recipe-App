const mealsElement = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");

const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const mealPopup = document.getElementById("meal-popup");
const popupCloseBtn = document.getElementById("close-popup");
const mealInfoElement = document.getElementById("meal-info");

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );

  const responseData = await response.json();
  const randomMeal = responseData.meals[0];

  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );

  const responseData = await response.json();

  const meal = responseData.meals[0];

  return meal;
}

async function getMealsBySearch(term) {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );

  const responseData = await response.json();
  const meals = responseData.meals;

  return meals;
}

function addMeal(mealData, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = `
          <div class="meal-header">
          ${random ? `<span class="random"> Random Recipe </span>` : ""}

            <img
              src="${mealData.strMealThumb}"
              alt="${mealData.strMeal}"
            />
          </div>
          <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
              <i class="fas fa-heart"></i>
            </button>
          </div>
    `;

  const btn = meal.querySelector(".meal-body .fav-btn");

  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeMealLS(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealLS(mealData.idMeal);
      ["active", "animate__bounceIn"].map((v) => btn.classList.toggle(v));
    }

    fetchFavMeals();
  });

  meal.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  mealsElement.appendChild(meal);
}

function addMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  favoriteContainer.innerHTML = "";

  const mealIds = getMealsLS();
  const meals = [];

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);
    addMealFav(meal);
  }
}

function addMealFav(mealData) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
           
            <img
              src="${mealData.strMealThumb}"
              alt="${mealData.strMeal}"
            /><span>${mealData.strMeal}</span>
            <button class="clear"><i class="fas fa-times-circle"></i></button>
    `;

  const btn = favMeal.querySelector(".clear");

  btn.addEventListener("click", () => {
    removeMealLS(mealData.idMeal);
    fetchFavMeals();
  });

  favoriteContainer.appendChild(favMeal);
}

function showMealInfo(mealData) {
  const mealElement = document.createElement("div");
  mealElement.innerHTML = `   
          <h1>${mealData.strMeal}</h1>
          <img
            src="${mealData.strMealThumb}"
            alt=""
          />
          <p>
            ${mealData.strInstructions}
          </p>
          `;

  mealInfoElement.appendChild(mealElement);

  mealPopup.classList.remove("hidden");
}

searchBtn.addEventListener("click", async () => {
  mealsElement.innerHTML = "";
  const search = searchTerm.value;

  const meals = await getMealsBySearch(search);

  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});

searchTerm.addEventListener("keyup", async (event) => {
  if (event.key == "Enter") {
    mealsElement.innerHTML = "";
    const search = searchTerm.value;

    const meals = await getMealsBySearch(search);

    if (meals) {
      meals.forEach((meal) => {
        addMeal(meal);
      });
    }
  }
});

popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});
