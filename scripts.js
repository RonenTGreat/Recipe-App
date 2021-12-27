const meals = document.getElementById('meals')

getRandomMeal();
fetchFavMeals();

async function getRandomMeal(){
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    const responseData = await response.json();
    const randomMeal = responseData.meals[0];

    addMeal(randomMeal, true);
}

async function getMealById(id){

    const response =  await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

    const responseData = await response.json();

    const meal = response.meals[0];

    return meal;

}

async function getMealsBySearch(term){
    const meals = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);

}

function addMeal(mealData,random = false){
    const meal = document.createElement('div');
    meal.classList.add('meal');

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

    btn.addEventListener('click', () => {
        if (btn.classList.contains("active")) {
          removeMealLS(mealData.idMeal)
          btn.classList.remove("active")
        }else{
            addMealLS(mealData.idMeal);
            ["active", "animate__bounceIn"].map((v) => btn.classList.toggle(v));
        }
    });

    

    meals.appendChild(meal)
}

function addMealLS(mealId){
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));

}

function removeMealLS(mealId){
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function getMealsLS(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;

}

async function fetchFavMeals(){
    const mealIds = getMealsLS();
    const meals = [];


    for(let i = 0; i < mealIds.length; i++){
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        addMealFav(meal);

    }


}


function addMealToFav(mealData) {
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
  });

  meals.appendChild(meal);
}