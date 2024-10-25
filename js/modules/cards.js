import { getResource } from '../services/services';

function cards() {
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 1;  // This is currently set to 1; update this for different conversions
            this.changeToUSD();
        }

        // Method to convert price to USD (or any other currency if needed)
        changeToUSD() {
            this.price = this.price * this.transfer;
        }

        // Method to render the card
        render() {
            const element = document.createElement('div');

            // Set default class if no classes are passed
            if (this.classes.length === 0) {
                this.elementClass = "menu_item";
                element.classList.add(this.elementClass);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            // HTML structure for the menu card
            element.innerHTML = `
                <img src="${this.src}" alt="${this.alt}">
                <h3 class="menu_item-subtitle">${this.title}</h3>
                <div class="menu_item-descr">${this.descr}</div>
                <div class="menu_item-divider"></div>
                <div class="menu_item-price">
                    <div class="menu_item-cost">Цена:</div>
                    <div class="menu_item-total"><span>${this.price}</span> евро/день</div>
                </div>
            `;

            // Append the card to the parent container
            this.parent.append(element);
        }
    }

    // Fetch data from the server and create new MenuCard instances for each item
    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        })
        .catch(error => console.error(error));
}

export default cards;
