window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu'),
          menuItem = document.querySelectorAll('.menu__item'),
          hamburger = document.querySelector('.hamburger'),
          advantageItem = document.querySelectorAll('.advantage__item');

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


    if (window.innerWidth < 768) {
        advantageItem.forEach(item => {
            item.classList.remove('wow');
            item.classList.remove('animate__animated');
            item.classList.remove('animate__zoomIn');
            /*             let _class=item.getAttribute('class');
                    let newClass=_class.replace(' wow', "");
                    item.setAttribute('class', newClass); */
        })
    }
});