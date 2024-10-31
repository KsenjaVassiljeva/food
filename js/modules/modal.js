function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);

    if (modal) {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Allow scrolling again
        console.log('Modal closed.');
    }
}

function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);

    if (modal) {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; // Disable scrolling

        if (modalTimerId) {
            clearInterval(modalTimerId);
        }
        console.log('Modal opened.');
    }
}

function modal(triggerSelector, modalSelector, modalTimerId) {
    const modalTrigger = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector);

    if (!modal) {
        console.error('Modal not found:', modalSelector);
        return;
    }

    const closeModalBtn = modal.querySelector('[data-close]');

    // Open modal on trigger button click
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal(modalSelector, modalTimerId);
        });
    });

    // Close modal on close button click
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            closeModal(modalSelector);
        });
    }

    // Close modal when clicking outside of it
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            console.log("Modal backdrop clicked.");
            closeModal(modalSelector);
            console.log('Modal closed.');
        }
    });

    // Close modal on "Escape" key press
    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            console.log("Escape key pressed.");
            closeModal(modalSelector);
        }
    });
}


// Usage:
export default modal;
export { closeModal, openModal };
