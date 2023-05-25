window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu'),
          menuItem = document.querySelectorAll('.menu__item'),
          hamburger = document.querySelector('.hamburger'),
          advantageItem = document.querySelectorAll('.advantage__item'),
          cookie = document.querySelector('.cookie'),
          ok = document.querySelector('#ok'),
          loginForm = document.querySelector('.login-form'),
          forEmployeesLink = document.querySelector('.menu__link_empl');

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

    ok.addEventListener('click', () => {
        cookie.classList.remove('cookie_active');
    });

    forEmployeesLink.addEventListener('click', () => {
        loginForm.classList.add('login-form_active');
    });

    const login = () => {
        const login = document.querySelector('input[name="login"]').value;
        const pass = document.querySelector('input[name="password"]').value;
    
        const url = 'https://test-shmest.com/back/signin'
    
    
           fetch(url, {method: 'POST',
           
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email: login, password: pass})
          }).then(response => response.json())
          .then(data => {
              let tkn = data.token
              localStorage.setItem('token', tkn)
              loginForm.classList.remove('login-form_active');
          })
    }


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