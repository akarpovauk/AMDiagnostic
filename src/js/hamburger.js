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
	      agreed = localStorage.getItem('policyAgreed');	

	let sheetId = ''
	
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
        const url = 'https://test-shmest.com/back/signin'
    
    
           fetch(url, {method: 'POST',
           
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email: login, password: pass})
          }).then(response => response.json())
          .then(data => {     
     let tkn = data.token
		if (tkn !== null && tkn !== undefined && tkn.length > 10) {
		debugger
             	localStorage.setItem('token', tkn)
                handleLogin();
		// let style = 'display: none;';
		// loginField.setAttribute('style', style);
		// passWordField.setAttribute('style', style);
           //  loginForm.classList.remove('login-form_active')
		}
          })

	} 

	} else {

		handleLogout();
	}
    });

    const handleLogout = () => {
		localStorage.removeItem('token')
    		let style = 'display: block;';
		let hideStyle = 'display: none;';
		logField().setAttribute('style', style);
		passField().setAttribute('style', style);
		document.querySelector('#loginSubmit>span').innerHTML = 'Sign in' 
		employees().setAttribute('style', hideStyle);
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
	var url = 'https://test-shmest.com/back/amds_enabled_sheets'

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


const showTable = () => {
    if (sheetId.length === 0) {
        sheetId = '6'
    }
    const url = '/amds/' + sheetId + ".html";
    fetch(url)
    .then(resp => resp.text())
    .then(data => console.log(data))
}

getEnabledIds().then(ids => console.log(ids))


handleLogout();
 
});



