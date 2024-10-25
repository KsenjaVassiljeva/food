function calc() {
    const result = document.querySelector(".calculating_result span");
    let sex, height, weight, age, ratio;

    // Retrieve values from localStorage or set default values
    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    // Function to calculate total based on input values
    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '';
            return;
        }

        // Calculate result based on the sex
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    // Function to initialize local settings and set active classes
    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);

            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }

            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    // Call initialization for 'sex' and 'ratio' settings
    initLocalSettings('#gender div', 'calculating_choose-item_active');
    initLocalSettings('.calculating_choose_big div', 'calculating_choose-item_active');

    // Function to handle static information updates (sex and ratio)
    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);

                calcTotal();
            });
        });
    }

    // Apply static event listeners
    getStaticInformation('#gender div', 'calculating_choose-item_active');
    getStaticInformation('.calculating_choose_big div', 'calculating_choose-item_active');

    // Function to handle dynamic input changes (height, weight, age)
    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = "1px solid red";
            } else {
                input.style.border = 'none';

                switch (input.getAttribute('id')) {
                    case "height":
                        height = +input.value;
                        break;
                    case "weight":
                        weight = +input.value;
                        break;
                    case "age":
                        age = +input.value;
                        break;
                }
            }

            calcTotal();
        });
    }

    // Apply dynamic event listeners to input fields
    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');

    // Initial calculation
    calcTotal();
}

// Call calc function to set everything in motion
calc();
