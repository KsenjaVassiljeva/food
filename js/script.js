window.addEventListener('DOMContentLoaded', function() {
    // Tabs
    let tabs = document.querySelectorAll('.tabheader_item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader_items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader_item_active');
        });
    }

    function showTabContent(i = 0) {
        console.log(`Showing tab index: ${i}`);
        console.log(`Tabs content length: ${tabsContent.length}`);

        if (i < 0 || i >= tabsContent.length) {
            console.error('Index out of bounds:', i);
            return; // Prevents the error by returning early
        }

        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader_item_active');
    }

    hideTabContent();
    showTabContent(); // This should be safe now

    tabsParent.addEventListener('click', function(event) {
        const target = event.target;
        if (target && target.classList.contains('tabheader_item')) { // Corrected class name
            tabs.forEach((item, i) => {
                if (target === item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer
    const contestDeadline = '2024-12-31T00:00:00';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            total: t,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    }

    function getZero(num) {
        return num >= 0 && num < 10 ? '0' + num : num;
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            const t = getTimeRemaining(endtime);
            if (t.total <= 0) {
                clearInterval(timeInterval);
                days.innerHTML = '00';
                hours.innerHTML = '00';
                minutes.innerHTML = '00';
                seconds.innerHTML = '00';
                return; // Stop execution
            }
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
        }
        
        updateClock(); // Initial call to display the clock immediately
    }

    setClock('.promotion__timer', contestDeadline);
    


    // Modal
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        clearInterval(modalTimerId); // Stops the timer if it exists
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Re-enable scrolling when modal is closed
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') === "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 300000); // 300,000ms = 5 minutes

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll); // Remove the event listener after the modal is triggered
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Menu Card
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes.length ? classes : ['menu__item']; // Default class if none provided
            this.parent = document.querySelector(parentSelector);
            this.transfer = 1; // Currency conversion rate (e.g., from another currency to USD)
            this.changeToUSD(); // Call method to convert price to USD
        }

        // Convert price to USD
        changeToUSD() {
            this.price = this.price * this.transfer; // Example: multiply by conversion rate
        }

        // Method to render the card in the DOM
        render() {
            const element = document.createElement('div');

            // Add the provided classes or the default one
            this.classes.forEach(className => element.classList.add(className));

            element.innerHTML = `
                <img src="${this.src}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Price:</div>
                    <div class="menu__item-total"><span>${this.price}</span> USD</div>
                </div>
            `;

            this.parent.append(element);
        }
    }

    async function getResource(url) {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    }

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        });

    // Form Handling
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так…'
    };

    forms.forEach(item => {
        bindPostData(item); // Ensure you pass the form to the bindPostData function
    });

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
        return await res.json(); // Return the parsed response
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                });
        });
    }

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');

    function showThanksModal(message) {
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>x</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        modal.append(thanksModal);
        openModal();
        setTimeout(() => {
            thanksModal.remove();
            closeModal();
        }, 4000); // Close the modal after 4 seconds
    }

    let offset = 0;
    let slideIndex = 1;
    const slides = document.querySelectorAll('.offer_slide'),
        slider = document.querySelector('.offer_slider'),
        prev = document.querySelector('.offer_slider-prev'),
        next = document.querySelector('.offer_slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer_slider-wrapper'),
        width = window.getComputedStyle(slidesWrapper).width,
        slidesField = document.querySelector('.offer_slider-inner');

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + "%"; // Fix missing '%' for width
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;

    slider.append(indicators);

    // Create dots for each slide
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
        `;
        if(i==0){
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    next.addEventListener('click', () => {
        // Check if offset is at the last slide
        if (offset === (deleteNotDigits(width) * (slides.length - 1))) {
            offset = 0; // Reset offset to the first slide
        } else {
            // Increment the offset by the width of each slide
            offset += deleteNotDigits(width); 
            
            // Update the transform property to move the slides
            slidesField.style.transform = `translateX(-${offset}px)`;
    
            // Update slide index
            slideIndex = (slideIndex === slides.length) ? 1 : slideIndex + 1;
    
            // Update current slide display
            current.textContent = slides.length < 10 ? `0${slideIndex}` : slideIndex;
    
            // Update the opacity of dots based on the current slide index
            updateDots();
        }
    });
    
    prev.addEventListener('click', () => {
        if (offset === 0) {
            offset = deleteNotDigits(width) * (slides.length - 1); // Reset offset to last slide
        } else {
            offset -= deleteNotDigits(width); // Decrement the offset by the slide width
        }
    
        // Update the transform property to move the slides
        slidesField.style.transform = `translateX(-${offset}px)`;
    
        // Update the slide index
        slideIndex = (slideIndex === 1) ? slides.length : slideIndex - 1;
    
        // Update current slide display
        current.textContent = slides.length < 10 ? `0${slideIndex}` : slideIndex;
    
        // Update the opacity of dots based on the current slide index
        updateDots();
    });
    
    // Function to update the dots' opacity
    function updateDots() {
        dots.forEach(dot => dot.style.opacity = "0.5"); // Set all dots to half opacity
        dots[slideIndex - 1].style.opacity = "1"; // Set the active dot's opacity to 1
    }
    
    // Event listener for dots
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo; // Corrected variable assignment
            offset = deleteNotDigits(width) * (slideTo - 1); // Ensure deleteNotDigits is defined
            slidesField.style.transform = `translateX(-${offset}px)`; // Use backticks for template literals
    
            // Update current slide display
            current.textContent = slides.length < 10 ? `0${slideIndex}` : slideIndex;
    
            // Update the opacity of dots based on the current slide index
            updateDots();
        });
    });

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }
    
    // Calculator
    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;
    
    // Set sex from localStorage or default to female
    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }
    
    // Set ratio from localStorage or default to 1.375
    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }
    
    // Calculate total
    function calcTotal() {
        // Ensure all values are valid
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = 'Provide all inputs';
            return; // Exit if inputs are not complete
        }
    
        // Calculate based on sex
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }
    
    // Initial calculation call
    calcTotal();
    
    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            
            // Set active class for sex
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            // Set active class for ratio
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }
    
    // Initialize local settings for gender and ratio
    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                // Check if the clicked element has a data-ratio attribute
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio'); // Set ratio
                    localStorage.setItem('ratio', ratio); // Store ratio in localStorage
                } else {
                    sex = e.target.getAttribute('id'); // Set sex
                    localStorage.setItem('sex', sex); // Store sex in localStorage
                }

                // Remove active class from all elements and add it to the clicked element
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);

                // Calculate total
                calcTotal();
            });
        });
    }

    // Initialize static information for gender and ratio
    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    // Function to handle dynamic input information
    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);
        
        input.addEventListener('input', () => {
            // Check for non-digit characters
            if (input.value.match(/\D/g)) {
                input.style.border = "1px solid red"; // Invalid input style
            } else {
                input.style.border = 'none'; // Valid input style
            }

            // Update corresponding variable based on input ID
            switch (input.getAttribute('id')) {
                case "height":
                    height = +input.value; // Convert input value to number
                    break;
                case "weight":
                    weight = +input.value; // Convert input value to number
                    break;
                case "age":
                    age = +input.value; // Convert input value to number
                    break;
            }

            // Calculate total after updating values
            calcTotal();
        });
    }

    // Initialize dynamic input information for height, weight, and age
    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');


})

