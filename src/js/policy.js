//const { addListener } = require("gulp");

window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu'),
          menuItem = document.querySelectorAll('.menu__item'),
          hamburger = document.querySelector('.hamburger'),
		  pageUp = document.querySelector('.pageup');
	
    window.scrollTo()

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('hamburger_active');
        menu.classList.toggle('menu_active');
    });

	menuItem.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.toggle('hamburger_active');
            menu.classList.toggle('menu_active');
        })
    });

	function showPageUp() {
		pageUp.classList.add('show');
		pageUp.classList.remove('hide');
	}

	function hidePageUp() {
		pageUp.classList.add('hide');
		pageUp.classList.remove('show');
	}

	function showPageUpByScroll() {
		if(window.scrollY >= 300) {
			showPageUp();
		} else {
			hidePageUp();
		}
	}

	window.addEventListener('scroll', showPageUpByScroll);

});