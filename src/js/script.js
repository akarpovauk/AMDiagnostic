window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu'),
          menuItem = document.querySelectorAll('.menu__item'),
          hamburger = document.querySelector('.hamburger');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('hamburger_active');
        menu.classList.toggle('menu_active');
    });

    menuItem.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.toggle('hamburger_active');
            menu.classList.toggle('menu_active');
        })
    })

/*     document.addEventListener("submit", function (event) {
        event.preventDefault();
       
        if (!validateForm(form)) {
          return;
        }
       
        fetch("mailer/smart.php", {
          method: "POST",
          body: new FormData(event.target),
        })
          .then(function (response) {
            if (response.ok) {
              return response.json();
            }
            return Promise.reject(response);
          })
          .then(function (data) {
            console.log(data);
          })
          .catch(function (error) {
            console.warn(error);
          });
      }); */
})