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
    const contestDeadline = '2021-10-31';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
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
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }

        updateClock();
    }

    setClock('.timer', contestDeadline); // Use contestDeadline

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
});
