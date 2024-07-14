

let app = {
    name: "Meal Finder",
    version: "1.0.0",
    creator: "Mohammed Aldraimli",
    dataContainer: $("#dataContainer"),
    detailsContainer: $("#detailsContainer"),
    searchContainer: $("#searchContainer"),
    init: function () {
        this.eventsHandler();
        this.sideBarEvents();
        this.getAllMeals();
    },
    eventsHandler: function () {
        /// open sidenav
        $(".open-close-icon").click(() => {
            if ($(".side-nav-menu").css("left") == "0px") {
                this.closeNav();
            } else {
                this.showNav();
            }
        });

        /// handle search by name 
        $(document).on("keyup", "#searchByName", (e) => {
            this.searchByName(e.target.value);
        });

        /// handle search by first letter
        $(document).on("keyup", "#searchByFirstLetter", (e) => {
            this.searchByFLetter(e.target.value);
        });


        /// handle meal click
        $(document).on("click", ".meal-selector", (e) => {
            this.getMealDetails($(e.target).closest(".meal").data("id"));
        });

        /// handle category click
        $(document).on("click", ".category-selector", (e) => {
            this.getCategoryMeals($(e.target).closest(".meal").data("id"));
        });

        /// handle area click
        $(document).on("click", ".area-selector", (e) => {
            this.getAreaMeals($(e.target).closest(".area-selector").data("id"));
        });

        /// handle ingredient click
        $(document).on("click", ".ingredient-selector", (e) => {
            this.getIngredientsMeals($(e.target).closest(".ingredient-selector").data("id"));
        });


        /// hide details container
        $(document).on("click", ".hide-details-class", () => {
            this.showDataContainer();
        });

        /// submit form
        $(document).on("click", "#submitBtn", () => {
            this.submitHandler();
        });

        /// inputs validation
        $(document).on("keyup", ".contact-input", (e) => {
            this.inputsValidation(e.target.id);
        });
    },
    sideBarEvents: function () {
                /// open search
                $("#search").click(() => {
                    this.showSearchInputs();
                    this.closeNav();
                });
        
                /// get categories
                $("#getCategories").click(() => {
                    this.getCategories();
                    this.closeNav();
                });
        
                /// getArea 
                $("#getArea").click(() => {
                    this.getArea();
                    this.closeNav();
                });
        
                /// getIngredients
                $("#getIngredients").click(() => {
                    this.getIngredients();
                    this.closeNav();
                });
        
                /// showContacts
                $("#showContacts").click(() => {
                    this.showContacts();
                    this.closeNav();
                });
    },
    showSearchInputs: function () {
        this.searchContainer.html(`
            <div class="row py-4 ">
                <div class="col-md-6 ">
                    <input id="searchByName" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
                </div>
                <div class="col-md-6">
                    <input id="searchByFirstLetter" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
                </div>
            </div>
        `);
        this.dataContainer.html("");
        this.showDataContainer();
    },
    getAllMeals: async function () {
        this.dataContainer.html("");
        $(".inner-loading-screen").fadeIn(300);
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
        response = await response.json();
        this.displayMeals(response.meals);
        $(".inner-loading-screen").fadeOut(300);
    },
    closeNav: function () {
        let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
        $(".side-nav-menu").animate({
            left: -boxWidth
        }, 500);
        $(".open-close-icon").addClass("fa-align-justify");
        $(".open-close-icon").removeClass("fa-x");
        $(".links li").animate({
            top: 300
        }, 500);
    },
    showNav: function () {
        $(".side-nav-menu").animate({
            left: 0
        }, 500);
        $(".open-close-icon").removeClass("fa-align-justify");
        $(".open-close-icon").addClass("fa-x");
        for (let i = 0; i < 5; i++) {
            $(".links li").eq(i).animate({
                top: 0
            }, (i + 5) * 100);
        }
    },
    searchByName: async function (term) {
        this.dataContainer.html("");
        $(".inner-loading-screen").fadeIn(300);
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        response = await response.json();
        response.meals ? this.displayMeals(response.meals) : this.displayMeals([]);
        $(".inner-loading-screen").fadeOut(300);
    },
    searchByFLetter: async function (term) {
        this.dataContainer.html("");
        $(".inner-loading-screen").fadeIn(300);
        term == "" ? term = "a" : "";
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
        response = await response.json();
        response.meals ? this.displayMeals(response.meals) : this.displayMeals([]);
        $(".inner-loading-screen").fadeOut(300);
    },
    displayMeals: function (arr) {
        let items = "";
        for (let i = 0; i < arr.length; i++) {
            items += `
                <div class="col-md-3">
                    <div data-id="${arr[i].idMeal}" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                        <img class="w-100" src
                        ="${arr[i].strMealThumb}" alt="" srcset="">
                        <div class="meal-layer
                        position-absolute d-flex align-items-center text-black p-2">
                            <h3>${arr[i].strMeal}</h3>
                        </div>
                    </div>
                </div>
            `;

            app.dataContainer.html(items);
            this.showDataContainer();
        }
    },
    getMealDetails: async function (mealID) {
        this.detailsContainer.html("");
        $(".inner-loading-screen").fadeIn(300);
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
        response = await response.json();
        this.displayMealDetails(response.meals[0]);
        $(".inner-loading-screen").fadeOut(300);
    },
    displayMealDetails(meal) {
        this.detailsContainer.html("");
        let ingredients = ``;
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
            }
        }
        let tags = meal.strTags?.split(",");
        if (!tags) tags = [];
        let tagsStr = '';
        for (let i = 0; i < tags.length; i++) {
            tagsStr += `
                <li class="alert alert-danger m-2 p-1">${tags[i]}</li>
            `;
        }
        let items = `
            <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
                <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8 position-relative">
                <i class="fa-solid fa-2x fa-x hide-details-class"></i>
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>
                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
        `;
        this.detailsContainer.html(items);
        this.showDetailsContainer();
    },
    showDetailsContainer: function () {
        this.detailsContainer.show();
        this.dataContainer.hide();
    },
    showDataContainer: function () {
        this.detailsContainer.hide();
        this.dataContainer.show(); 
    },
    getCategories: async function () {
        this.dataContainer.html("");
        $(".inner-loading-screen").fadeIn(300);
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        response = await response.json();
        this.renderCategories(response.categories);
        $(".inner-loading-screen").fadeOut(300);
    },
    renderCategories: function (arr) {
        let items = "";
        for (let i = 0; i < arr.length; i++) {
            items += `
                <div class="col-md-3">
                    <div data-id="${arr[i].strCategory}" class="meal category-selector position-relative overflow-hidden rounded-2 cursor-pointer">
                        <img class="w-100" src = "${arr[i].strCategoryThumb}" alt="" srcset="">
                        <div class="meal-layer position-absolute text-center text-black p-2">
                            <h3>${arr[i].strCategory}</h3>
                            <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                        </div>
                    </div>
                </div>
            `;
        }
        app.dataContainer.html(items);
        this.showDataContainer();
    },
    getCategoryMeals: async function (category) {
        this.dataContainer.html("");
        $(".inner-loading-screen").fadeIn(300);
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        response = await response.json();
        this.displayMeals(response.meals.slice(0, 20));
        $(".inner-loading-screen").fadeOut(300);
    },
    displayMeals: function (arr) {
        let items = "";
        for (let i = 0; i < arr.length; i++) {
            items += `
                <div class="col-md-3">
                    <div data-id="${arr[i].idMeal}" class="meal meal-selector position-relative overflow-hidden rounded-2 cursor-pointer">
                        <img class="w-100" src = "${arr[i].strMealThumb}" alt="" srcset="">
                        <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                            <h3>${arr[i].strMeal}</h3>
                        </div>
                    </div>
                </div>
            `;
        }
        app.dataContainer.html(items);
        this.showDataContainer();
    },
    getArea: async function () {
        this.dataContainer.html("");
        $(".inner-loading-screen").fadeIn(300);
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        response = await response.json();
        this.displayArea(response.meals);
        $(".inner-loading-screen").fadeOut(300);
    },
    displayArea: function (arr) {
        let items = "";
        for (let i = 0; i < arr.length; i++) {
            items += `
                <div class="col-md-3">
                    <div data-id="${arr[i].strArea}" class="area-selector rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                    </div>
                </div>
            `;
        }
        app.dataContainer.html(items);
        this.showDataContainer();
    },
    getAreaMeals: async function (area) {
        this.dataContainer.html("");
        $(".inner-loading-screen").fadeIn(300);
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        response = await response.json();
        this.displayMeals(response.meals.slice(0, 20));
        $(".inner-loading-screen").fadeOut(300);
    },
    displayMeals: function (arr) {
        let items = "";
        for (let i = 0; i < arr.length; i++) {
            items += `
                <div class="col-md-3">
                    <div data-id="${arr[i].idMeal}" class="meal meal-selector position-relative overflow-hidden rounded-2 cursor-pointer">
                        <img class="w-100" src = "${arr[i].strMealThumb}" alt="" srcset="">
                        <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                            <h3>${arr[i].strMeal}</h3>
                        </div>
                    </div>
                </div>
            `;
        }
        app.dataContainer.html(items);
        this.showDataContainer();
    },
    getIngredients: async function () {
        this.dataContainer.html("");
        $(".inner-loading-screen").fadeIn(300);
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
        response = await response.json();
        this.displayIngredients(response.meals.slice(0, 20));
        $(".inner-loading-screen").fadeOut(300);
    },
    displayIngredients: function (arr) {
        let items = "";
        for (let i = 0; i < arr.length; i++) {
            items += `
                <div class="col-md-3">
                    <div data-id="${arr[i].strIngredient}" class="ingredient-selector rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
            `;
        }
        app.dataContainer.html(items);
        this.showDataContainer();
    },
    getIngredientsMeals: async function (ingredients) {
        this.dataContainer.html("");
        $(".inner-loading-screen").fadeIn(300);
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
        response = await response.json();
        this.displayMeals(response.meals.slice(0, 20));
        $(".inner-loading-screen").fadeOut(300);
    },
    showContacts: function () {
      let html = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="nameInput" type="text" class="form-control contact-input" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Special characters and numbers not allowed
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="emailInput" type="email" class="form-control contact-input" placeholder="Enter Your Email">
                    <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Email not valid * 
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="phoneInput" type="text" class="form-control contact-input" placeholder="Enter Your Phone">
                    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid Phone Number
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="ageInput" type="number" class="form-control contact-input" placeholder="Enter Your Age">
                    <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid age
                    </div>
                </div>
                <div class="col-md-6">
                    <input  id="passwordInput" type="password" class="form-control contact-input" placeholder="Enter Your Password">
                    <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                </div>
                <div class="col-md-6">
                    <input  id="repasswordInput" type="password" class="form-control contact-input" placeholder="Repassword">
                    <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid repassword 
                    </div>
                </div>
            </div>
            <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
        </div>
    </div> `;
    this.dataContainer.html(html);
    this.showDataContainer();
    },
    submitHandler: function () {
        alert("Form Submitted");
        setTimeout(() => {
            this.getAllMeals();
        }
        , 1000);

    },
    inputsValidation: function (inputId) {
        let nameInputTouched = false;
        let emailInputTouched = false;
        let phoneInputTouched = false;
        let ageInputTouched = false;
        let passwordInputTouched = false;
        let repasswordInputTouched = false;

        if(inputId == "nameInput") {
            nameInputTouched = true;
        }
        else if(inputId == "emailInput") {
            emailInputTouched = true;
        }
        else if(inputId == "phoneInput") {
            phoneInputTouched = true;
        }
        else if(inputId == "ageInput") {
            ageInputTouched = true;
        }
        else if(inputId == "passwordInput") {
            passwordInputTouched = true;
        }
        else if(inputId == "repasswordInput") {
            repasswordInputTouched = true;
        }

        let nameValidation = () => {
            return (/^[a-zA-Z ]+$/.test($("#nameInput").val()));
        };
        let emailValidation = () => {
            return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#emailInput").val()));
        };
        let phoneValidation = () => {
            return (/^01[0125][0-9]{8}$/.test($("#phoneInput").val()));
        };
        let ageValidation = () => {
            return (/^[0-9]+$/.test($("#ageInput").val()));
        };
        let passwordValidation = () => {
            return (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test($("#passwordInput").val()));
        };
        let repasswordValidation = () => {
            return ($("#passwordInput").val() == $("#repasswordInput").val());
        };

        if (nameInputTouched) {
            if (nameValidation()) {
                $("#nameAlert").removeClass("d-block").addClass("d-none");
            } else {
                $("#nameAlert").removeClass("d-none").addClass("d-block");
            }
        }
        if (emailInputTouched) {
            if (emailValidation()) {
                $("#emailAlert").removeClass("d-block").addClass("d-none");
            } else {
                $("#emailAlert").removeClass("d-none").addClass("d-block");
            }
        }
        if (phoneInputTouched) {
            if (phoneValidation()) {
                $("#phoneAlert").removeClass("d-block").addClass("d-none");
            } else {
                $("#phoneAlert").removeClass("d-none").addClass("d-block");
            }
        }
        if (ageInputTouched) {
            if (ageValidation()) {
                $("#ageAlert").removeClass("d-block").addClass("d-none");
            } else {
                $("#ageAlert").removeClass("d-none").addClass("d-block");
            }
        }
        if (passwordInputTouched) {
            if (passwordValidation()) {
                $("#passwordAlert").removeClass("d-block").addClass("d-none");
            } else {
                $("#passwordAlert").removeClass("d-none").addClass("d-block");
            }
        }
        if (repasswordInputTouched) {
            if (repasswordValidation()) {
                $("#repasswordAlert").removeClass("d-block").addClass("d-none");
            } else {
                $("#repasswordAlert").removeClass("d-none").addClass("d-block");
            }
        }
        if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation()) {
            $("#submitBtn").removeAttr("disabled");
        } else {
            $("#submitBtn").attr("disabled", "disabled");
        }
    }

}


$(document).ready(function () {
    app.init();
});