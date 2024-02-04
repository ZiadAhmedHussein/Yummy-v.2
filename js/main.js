

$("a").click(function(e) {
  e.preventDefault();
});
// sidebar operations
$('.main-navbar').css('left' , -$('.navbar-content').innerWidth());
$('.main-links li').css('top' , 500)

let navbarWidth = $('.navbar-content').innerWidth()

function closeSidebar() {
  $('.main-navbar').animate({
    'left': - navbarWidth
  }, (500))
  $('.navbar-shower-icon i').toggleClass("d-none");
}

$('.navbar-shower-icon').click(() => {
  $('.navbar-shower-icon i').toggleClass("d-none");
    if($('.main-navbar').css('left') === '0px') {
      $('.main-navbar').animate({
        'left': - navbarWidth
      }, (500))
      $('.main-links li').animate({
        'top' : 500
      }, (1000))
    }else {
      $('.main-navbar').animate({
        'left': 0
      }, (500))

      $('.main-links li:first-child').animate({
          'top' : 0
        }, (450) , () => {

          $('.main-links li:nth(1)').animate({
            'top' : 0
          }, (150), () => {

            $('.main-links li:nth(2)').animate({
              'top' : 0
            }, (150) , () => {

              $('.main-links li:nth(3)').animate({
                'top' : 0
              }, (150), () => {

                $('.main-links li:nth(4)').animate({
                  'top' : 0
                }, (150))
              })
            })
          })
        })
    }
});

// ###########


// lazyload

function lazyLoadShower(parent) {
  $(`${parent}`).html(`
  <div class="lazy-load d-flex justify-content-center align-items-center z-3 position-absolute top-0 start-0 w-100 bg-black h-100">
    <div class="spinner-border text-white fs-1" role="status">
    </div>
  </div>
  `);
  $(`${parent}`).css(`position`,`relative`)
}
function lazyLoadRemover() {
  $('.lazy-load').remove();
}

// defualt home operation


async function headerMeal () {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
  $(response).ready(lazyLoadRemover());
  let responsObject = await response.json();
  console.log(responsObject);
  displayMealsDetails(responsObject.meals);
}
headerMeal ();

// ###########

function displayMealsDetails(arr) {
  if (arr.length >= 1) {
    for (let i = 0; i < 20; i++) {
      creatMealsCard(arr, i);
    }
    mealDetailsShowerByClick ()
  }
}


function creatMealsCard(arr, index) {
  document.querySelector('header .header-meals').innerHTML += `
    <div class="inner-mail-card mb-4 col-12 col-md-3 px-3">
      <div class="mail-card-content position-relative rounded-3 overflow-hidden">
        <div class="meal-img h-100">
          <img class="w-100" src="${arr[index].strMealThumb}" alt="${arr[index].strMeal} meal image">
        </div>
        <div dataID=${arr[index].idMeal} class="mail-name d-flex align-items-center h-100 w-100 position-absolute start-0 text-black fs-3 px-2 fw-medium">
          <p class="m-0 p-0 overflow-auto">${arr[index].strMeal}</p>
        </div>
      </div>
    </div>
  `
}

async function getMealById(idMeal) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
  $(response).ready(lazyLoadRemover());
  let responsObject = await response.json();
  buildMealDetails ((responsObject.meals)[0]);

}

function mealDetailsShowerByClick () {
  if ($('.mail-name')) {
    $('.mail-name').click((e) => {
      $('.search-meals').css('display', 'none')
      lazyLoadShower(`header header-meals`);
      getMealById($(e.currentTarget).attr('dataID'));
    })
  }
}

function buildMealDetails (mealObj) {
  $('header .row.header-meals').html(`
    <div class="inner col-12 col-md-4 px-3 bg-black text-white">
      <div class="meal-imge-name">
        <div class="meal-img w-100 rounded-3 overflow-hidden">
          <img class="w-100" src="${mealObj.strMealThumb}" alt="${mealObj.strMeal} meal image">
        </div>
        <h2 class="fs-3 fw-bold">${mealObj.strMeal}</h2>
      </div>
    </div>
    <div class="inner col-12 col-md-8 px-3 bg-black">
      <div class="meal-details-content d-flex flex-column gap-2">
        <div class="meal-instructions text-white">
          <h3 class="fs-3 fw-bold">Instructions</h3>
          <p class="m-0">${mealObj.strInstructions}</p>
        </div>
        <div class="meal-area text-white d-flex align-items-center gap-2">
          <h3 class="fs-3 fw-bold">Area :</h3>
          <p class="m-0 fs-3 fw-medium">${mealObj.strArea}</p>
        </div>
        <div class="meal-category text-white d-flex align-items-center gap-2">
          <h3 class="fs-3 fw-bold">Category :</h3>
          <p class="m-0 fs-3 fw-medium">${mealObj.strCategory}</p>
        </div>
        <div class="meal-recipes d-flex flex-column gap-2">
          <h3 class="text-white fs-3 fw-bold">Recipes :</h3>
          <ul class="list-unstyled d-flex flex-wrap gap-3 ms-2">
          ${recipesShower(mealObj)}
          </ul>
        </div>
        <div class="meal-tags">
          <h3 class="text-white fs-3 fw-bold">Tags :</h3>
          ${tagsCheckerAndShower(mealObj)}
          
        </div>
        <div class="meal-links text-white">
          <button class="btn btn-success">
            <a href="${mealObj.strSource}">Source</a>
          </button>
          <button class="btn btn-danger">
            <a href="${mealObj.strYoutube}">
              Youtube
            </a>
          </button>
        </div>
      </div>
    </div>
  `)
}

function recipesShower (mealObj) {
  let arrOfRecipes = ``;
  for (let index = 1; index < 21; index++) {
    if(mealObj[`strMeasure${index}`] != null && mealObj[`strIngredient${index}`] != null) {
      if (mealObj[`strMeasure${index}`].trim() !== ""  && mealObj[`strIngredient${index}`].trim() !== "") {
        arrOfRecipes += `<li class="bg-light rounded-2 p-2">${mealObj[`strMeasure${index}`]} ${mealObj[`strIngredient${index}`]}</li>`
      }
    }
  }
  return arrOfRecipes
}

function tagsCheckerAndShower(mealObj) {
  if (mealObj.strTags == null) {
    return "";
  } else {
    let tagsArr = mealObj.strTags.split(",");
    let tags = ``;
    for (let index = 0; index < tagsArr.length; index++) {
      tags += `<p class="ms-2 mt-2 bg-light rounded-2 p-2 d-inline-block">${tagsArr[index]}</p>`
    }
    return tags;
  }
}




// serch operation
$('nav a[href="#search"]').click(() => {
  closeSidebar();
  $('.search-meals').css('display', 'flex')
  $('header .header-meals').html(' ');
  headerMeal ();
});
// search meal by name
let inputSearchMealByName = document.querySelector('.search-meals input.search-name');

async function searchMealByName (mealName) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
  $(response).ready(lazyLoadRemover());
  let mealsSerchByNameArr = await response.json();
  if (mealsSerchByNameArr.meals) {
    for (let i = 0; i < mealsSerchByNameArr.meals.length; i++) {
      displayMealsDetails(mealsSerchByNameArr.meals);
    }
  }
}

inputSearchMealByName.addEventListener('input' , (e) => {
  $('header .header-meals').html(' ');
  lazyLoadShower(`header .header-meals`);
  searchMealByName (e.target.value);
});
// ####################
// search meal by first letter
let inputSearchMealByFrLetter = document.querySelector('.search-meals input.search-f-letter');

async function searchMealByFrLetter (mealFrLetter) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${mealFrLetter}`)
  $(response).ready(lazyLoadRemover());
  let mealsSearchByFrLetterArr = await response.json();
  if (mealsSearchByFrLetterArr.meals) {
    for (let i = 0; i < mealsSearchByFrLetterArr.meals.length; i++) {
      displayMealsDetails(mealsSearchByFrLetterArr.meals);
    }
  }
};

inputSearchMealByFrLetter.addEventListener('input' , (e) => {
  $('header .header-meals').html(' ')
  lazyLoadShower(`header .header-meals`);
  if(e.target.value.trim()) {
    searchMealByFrLetter(e.target.value);
  }
  
});
//#################


// meal categories





// meal categories operation
$('nav a[href="#categories"]').click(() => {
  closeSidebar();
  $('.search-meals').css('display', 'none')
  lazyLoadShower(`header .header-meals`);
  mealCategories();
});

async function mealCategories () {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
  $(response).ready($('.lazy-load').remove());
  let categoriesArr = await response.json();
  displayCatigoriesDetails(categoriesArr)
  
}


function displayCatigoriesDetails(arr) {
  if (arr.categories.length >= 1) {
    for (let i = 0; i < arr.categories.length; i++) {
      creatMealCatigoriesCard(arr.categories, i);
    }
    catigoryDetailsShowerByClick ();
  }
}
function creatMealCatigoriesCard(arr, index) {
  document.querySelector('header .header-meals').innerHTML += `
    <div class="inner-mail-card mb-4 col-12 col-md-3 px-3">
      <div class="mail-card-content position-relative rounded-3 overflow-hidden">
        <div class="meal-img h-100">
          <img class="w-100" src="${arr[index].strCategoryThumb}" alt="${arr[index].strCategory} meal image">
        </div>
        <div class="catigory-name d-flex flex-column align-items-center justify-content-center h-100 w-100 position-absolute start-0 text-black px-2  text-center">
          <h3 class="fs-3 fw-bold">${arr[index].strCategory}</h3>
          <p class="m-0 p-0 overflow-auto fw-medium">${arr[index].strCategoryDescription}</p>
        </div>
      </div>
    </div>
  `
}
async function mealsOfCatigory (catigoryName) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catigoryName}`)
  $(response).ready(lazyLoadRemover());
  let mealsOfCatigoryarr = await response.json();
  // console.log(mealsOfCatigoryarr)
  displayMealsDetails(mealsOfCatigoryarr.meals);
}


function catigoryDetailsShowerByClick () {
  
  if ($('.catigory-name')) {
    $('.catigory-name').click((e) => {
      lazyLoadShower(`header .header-meals`);
      
      mealsOfCatigory(e.currentTarget.children[0].innerText);
    })
  }
}
// ##################

// AreaOperation


$('nav a[href="#area"]').click(() => {
  closeSidebar();
  $('.search-meals').css('display', 'none')
  lazyLoadShower(`header .header-meals`);
  getAllAreasOfMeals ()
});


async function getAllAreasOfMeals () {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
  $(response).ready(lazyLoadRemover());
  let allAreasOfMeal = await response.json();
  displayAreasDetails(allAreasOfMeal.meals);
}

function displayAreasDetails(arr) {
  if (arr.length >= 1) {
    for (let i = 0; i < arr.length; i++) {
      creatAreaCard(arr, i);
    }
    areaDetailsShowerByClick()
  }
}

function creatAreaCard(arr, index) {
  document.querySelector('header .header-meals').innerHTML += `
    <div class="inner-mail-card mb-4 col-12 col-md-3">
      <div class="area-card-content text-center text-white align">
        <div class="area-icon display-1">
          <i class="fa-solid fa-house-laptop"></i>
        </div>
        <div dataAreaName=${arr[index].strArea} class="area-name align-items-center h-100 fs-3 px-2 fw-medium">
          <p class="m-0 p-0 text-white">${arr[index].strArea}</p>
        </div>
      </div>
    </div>
  `
}

function areaDetailsShowerByClick() {
  if ($(`.area-name`)) {
    $(`.area-card-content`).click((e) => {
      lazyLoadShower(`header .header-meals`);
      getAllMealsOfAreas($(e.currentTarget.children[1]).attr('dataAreaName'));
    })
  }
}

async function getAllMealsOfAreas (areaName) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
  $(response).ready(lazyLoadRemover());
  let allMealsOfArea = await response.json();
  displayMealsDetails(allMealsOfArea.meals);
}

// #######################





// ingrediant operation

$('nav a[href="#ingredients"]').click(() => {
  closeSidebar();
  $('.search-meals').css('display', 'none')
  lazyLoadShower(`header .header-meals`);
  getAllIngredientsOfMeals ()
});


async function getAllIngredientsOfMeals () {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
  $(response).ready(lazyLoadRemover());
  let allIngredientsOfMeal = await response.json();
  console.log(allIngredientsOfMeal.meals)
  displayIngredientsDetails(allIngredientsOfMeal.meals)
  // displayAreasDetails(allAreasOfMeal.meals);
}

function displayIngredientsDetails(arr) {
  if (arr.length >= 1) {
    for (let i = 0; i < 20; i++) {
      creatIngredientCard(arr, i);
    }
    IngredientDetailsShowerByClick()
  }
}

function creatIngredientCard(arr, index) {
  document.querySelector('header .header-meals').innerHTML += `
    <div class="inner-mail-card mb-4 col-12 col-md-3">
      <div class="ingredient-card-content text-center text-white align">
        <div class="area-icon display-1">
          <i class="fa-solid fa-drumstick-bite"></i>
        </div>
        <div dataIngredientName=${arr[index].strIngredient} class="ingredient-name align-items-center h-100  px-2">
          <h3 class="fs-3 fw-medium">${arr[index].strIngredient}</h3>
          <p class="m-0 p-0 text-white">${arr[index].strDescription.slice(0, 110)}</p>
        </div>
      </div>
    </div>
  `
}

function IngredientDetailsShowerByClick() {
  if ($(`.ingredient-name`)) {
    $(`.ingredient-card-content`).click((e) => {
      lazyLoadShower(`header .header-meals`);
      getAllMealsOfIngredient($(e.currentTarget.children[1]).attr('dataIngredientName'));
    })
  }
}

async function getAllMealsOfIngredient (ingredientName) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`);
  $(response).ready(lazyLoadRemover());
  let allMealsOfIngredient = await response.json();
  displayMealsDetails(allMealsOfIngredient.meals);
}

//########################



$('nav a[href="#contactUs"]').click(() => {
  closeSidebar();
  $('.search-meals').css('display', 'none')
  contactUsFormShower()
  formValidation()
});

function contactUsFormShower() {
  $('header .header-meals').html(`
    <form action="#" class="contactUs-form d-flex justify-content-center align-items-center flex-column w-75 mx-auto vh-100 gap-3">
      <div class="row g-3">
        <div class="inner-uName px-3 col-12 col-md-6">
          <label for="uName" class="d-none"></label>
          <input class="rounded-3 p-2 w-100" placeholder="Enter Your Name" id="uName" type="text">
          <p class="d-none name-valid mt-2 bg-danger-subtle text-danger p-3 text-center rounded-3">Special characters and numbers not allowed</p>
        </div>

        <div class="inner-uEmail px-3 col-12 col-md-6">
          <label for="uEmail" class="d-none"></label>
          <input class="rounded-3 p-2 w-100" placeholder="Enter Your Email" id="uEmail" type="text">
          <p class="email-valid mt-2 bg-danger-subtle text-danger p-3 text-center rounded-3">Email not valid *exemple@yyy.zzz</p>
        </div>

        <div class="inner-uPhone px-3 col-12 col-md-6">
          <label for="uPhone" class="d-none"></label>
          <input class="rounded-3 p-2 w-100" placeholder="Enter Your Phone" id="uPhone" type="text">
          <p class="phone-valid mt-2 bg-danger-subtle text-danger p-3 text-center rounded-3">Enter valid Phone Number</p>          
        </div>

        <div class="inner-uAge px-3 col-12 col-md-6">
          <label for="uAge" class="d-none"></label>
          <input class="rounded-3 p-2 w-100" placeholder="Enter Your Age" id="uAge" type="text">
          <p class="age-valid mt-2 bg-danger-subtle text-danger p-3 text-center rounded-3">Enter valid age</p>
        </div>

        <div class="inner-uPassword px-3 col-12 col-md-6">
          <label for="uPassword" class="d-none"></label>
          <input class="rounded-3 p-2 w-100" placeholder="Enter Your Password" id="uPassword" type="text">
          <p class="password-valid mt-2 bg-danger-subtle text-danger p-3 text-center rounded-3">Enter valid password *Minimum eight characters, at least one letter and one number:*</p>
        </div>

        <div class="inner-uRepassword px-3 col-12 col-md-6">
          <label for="uRepassword" class="d-none"></label>
          <input class="rounded-3 p-2 w-100" placeholder="Repassword" id="uRepassword" type="text">
          <p class="repassword-valid mt-2 bg-danger-subtle text-danger p-3 text-center rounded-3">Enter valid repassword</p>
        </div>
      </div>
        
      <button class="btn disabled btn-outline-danger" type="submit">Submit</button>
    </form>
  `);
};

function formValidation() {
  if($('.header-meals form')) {
    let uNameInput = document.querySelector('.inner-uName input')
    console.log(uNameInput)
    uNameInput.addEventListener('input', (e) => {
      nameValidation(e.target)
      // uNameInput.onfocus($(uNameInput).css('border', 'none'))
    });
    
    // let uNameInput = document.querySelector('.inner-uName input')
    // let uNameInput = document.querySelector('.inner-uName input')
    // let uNameInput = document.querySelector('.inner-uName input')
    // let uNameInput = document.querySelector('.inner-uName input')
    // let uNameInput = document.querySelector('.inner-uName input')

  }
}

function nameValidation(uName) {
  let namePattern = /^[a-z]{2,15}(\s[a-z]{1,15}){1,3}$/ig;
  if (namePattern.test(uName.value.trim())) {
    $(uName).css('border-color', 'red');
    console.log('yes')
    $('.inner-uName p').addClass('d-none')
  }else {
    console.log('no');
    $('.inner-uName p').removeClass('d-none')
  }
  console.log(uName.value)
}



























