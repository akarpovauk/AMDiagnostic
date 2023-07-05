window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu'),
          menuItem = document.querySelectorAll('.menu__item'),
          hamburger = document.querySelector('.hamburger'),
          advantageItem = document.querySelectorAll('.advantage__item'),
          cookie = document.querySelector('.cookie'),
          ok = document.querySelector('#ok'),
          loginForm = document.querySelector('.login-form'),
          forEmployeesLink = document.querySelector('.menu__link_empl');
		  loginSumbitButton = document.getElementById('loginSubmit');
          loginError = document.getElementById('login-error');	
	      agreed = localStorage.getItem('policyAgreed');	

          tabs = Array.from({ length: 20 }, (_, index) => document.getElementById(index + 1 + '_t'));

    window.scrollTo()

 
 

    const logField = () => {
		return document.querySelector('input[name="login"]');
	}	
    const passField = () => {
		return document.querySelector('input[name="password"]');
	}	
	const employees = () => {
		return document.querySelector('#portal');
	}
     	
	

    if (agreed !== null && agreed !== undefined && agreed === 'yes') {
	cookie.classList.remove('cookie_active');
    }

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('hamburger_active');
        menu.classList.toggle('menu_active');
    });

    tabs.forEach(item => {
        if (item !== null) {
            item.addEventListener('click', () => {

            tabs.forEach(tab => {
                if (tab !== null) {
                const id = tab.getAttribute('id')
                if (id !== item.getAttribute('id')) {
                    if (!isFilled(id.replace('_t', '')))
                    tab.classList.remove('portal__tab_active')
                }

                } 
                 
                
                
            })

            if (!isFilled(item.getAttribute('id').replace('_t', ''))) {
            item.classList.add('portal__tab_active')
        }
        })


     
        
        }

    });

    menuItem.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.toggle('hamburger_active');
            menu.classList.toggle('menu_active');
        })
    });


    ok.addEventListener('click', () => {
        cookie.classList.remove('cookie_active');
	localStorage.setItem('policyAgreed', 'yes');
    });

    forEmployeesLink.addEventListener('click', () => {
        loginForm.classList.add('login-form_active');
    });

    loginSumbitButton.addEventListener('click', () => {
        if (document.querySelector('#loginSubmit>span').innerHTML.toLowerCase() === 'sign in') {

        let login = logField().value;
        let pass = passField().value;
	
	if (login !== null && login !== undefined && login.length > 2) {
        //const url = 'https://test-shmest.com/back/signin'
          //const url = 'http://localhost:8082/signin'  
          const url = 'https://amdiagnostic.co.uk/back/signin'
    
           fetch(url, {method: 'POST',
           
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email: login, password: pass})
          }).then(response => response.json())
          .then(data => {     
     let tkn = data.token
		if (tkn !== null && tkn !== undefined && tkn.length > 10) {
             	localStorage.setItem('token', tkn)
                loginError.classList.remove('login-form__error_active')
                handleLogin();

		} else {
             loginError.classList.add('login-form__error_active')
        }
          })

	} 

	} else {
        location.reload()
		handleLogout();
	}
    });

    const handleLogout = () => {
       // document.location.href = document.location.href
		localStorage.removeItem('token')
    		let style = 'display: block;';
		let hideStyle = 'display: none;';
		logField().setAttribute('style', style);
		passField().setAttribute('style', style);
		document.querySelector('#loginSubmit>span').innerHTML = 'Sign in' 
		employees().setAttribute('style', hideStyle);
        // let lo = document.location.href;
        // document.location.href = lo;
    }



	const handleLogin = () => {
    	let style = 'display: none;';
		let displayStyle = 'display: block;'
		logField().setAttribute('style', style);
		passField().setAttribute('style', style);
		document.querySelector('#loginSubmit>span').innerHTML = 'Sign out'
		employees().setAttribute('style', displayStyle); 
		employees().scrollIntoView();
		showTable()
        
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

	const getEnabledIds = () => {

	return new Promise((resolve) => {
  	var token = localStorage.getItem('token');
	var url = 'https://amdiagnostic.co.uk/back/amds_enabled_sheets'

	fetch(url, {
     	method: 'GET',
      	headers: { 'Content-Type': 'application/json', 
                 'token': token}
	}).then(resp => resp.json())
  	.then(response => {
        resolve(response.message)
  	})    
	} )  

	}


 
getEnabledIds().then(ids => console.log(ids))


handleLogout();
 
});



