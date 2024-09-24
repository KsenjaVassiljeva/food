window.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function(event) {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target === item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer functionality
    const deadline = '2024-12-11';  // Updated deadline

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date());
        let days, hours, minutes, seconds;

        if (t <= 0) {
            return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((t / 1000 / 60) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }

        return { total: t, days, hours, minutes, seconds };
    }

    function getZero(num) {
        return num < 10 ? '0' + num : num;
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds');

        function updateClock() {
            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }

        updateClock(); // Run the clock immediately
        const timeInterval = setInterval(updateClock, 1000);
    }

    setClock('.timer', deadline);

    // Slider functionality
    const slides = document.querySelectorAll('.offer__slide');
    let currentSlide = 0;
    const totalSlides = slides.length;

    document.getElementById('total').textContent = getZero(totalSlides); // Update total slides

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('show');
                slide.classList.remove('hide');
            } else {
                slide.classList.remove('show');
                slide.classList.add('hide');
            }
        });
        document.getElementById('current').textContent = getZero(index + 1);
    }

    showSlide(currentSlide);

    function changeSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Automatic slide change
    let slideInterval = setInterval(changeSlide, 3000); // Change slides every 3000 ms (3 seconds)

    function resetSlideInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(changeSlide, 3000); // Restart automatic change
    }

    document.querySelector('.offer__slider-prev').addEventListener('click', () => {
        currentSlide = (currentSlide === 0) ? totalSlides - 1 : currentSlide - 1;
        showSlide(currentSlide);
        resetSlideInterval();
    });

    document.querySelector('.offer__slider-next').addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
        resetSlideInterval();
    });
});
