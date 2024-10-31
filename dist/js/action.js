

let sheetId = ''
let userId = ''
let fileId = ''
let userName = ''
let prefix = ''
let userToken = ''
let backendUrl = (document.location.href.indexOf('localhost') > -1) ? 'http://localhost:8082/' : 'https://amdiagnostic.co.uk/back/';
const template = "//td[contains(text(), '<name>')]/parent::*/td[<number>]"
//   let prefix = ''
//   let backendUrl = 'http://localhost:8082/';

let vis = []
let fil = []

const expand = (a) => {
    if (!vis.includes(a)) {
        vis.push(a)
    }
    clearForm().then((anc) => {
    sheetId = (a.replace('_t', ''))
  
    showTable();
    })

 return sheetId;
}
const unlock = () => {
    var url = backendUrl + 'unlock?userId=' + userId;
    fetch(url, {
        method: 'GET',
        headers: {token: localStorage.getItem('token')}
    }).then(response => response.json())
    .then(data => {
        if(data.message === 1) {
            setLocked();
        } else {
            setUnlocked();
        }
    })
}
const setLocked = () => {
    var but = document.getElementById('locked-button');
    var loc = document.getElementById('locked');
    but.innerHTML = 'unlock';
    but.onclick = unlock;
    loc.innerHTML = 'credentials are locked for user: ' + userName + '. unlock?'
    loc.classList.add('locked-text_locked');
}

const changePassword = () => {
    var pass = document.getElementById('re-password');
    var conPass = document.getElementById('confirm-re-password');
    var err = document.getElementById('reset-error');
    err.classList.remove('login-form__dark-error_active');
    if (pass.value !== '' && pass.value === conPass.value && pass.value.length > 3) {
            var url = backendUrl + 'reset?userId=' + userId + '&password=' +  pass.value;
    fetch(url, {
        method: 'GET',
        headers: {token: localStorage.getItem('token')}
    }).then(response => response.json())
    .then(data => {
        if (data.message && data.message === 'success') {
            alert('The password was successfully reset!');
            pass.value = '';
            conPass.value = '';
        }
    })
    } else {
        err.classList.add('login-form__dark-error_active');
    }

}

const setUnlocked = () => {
    var but = document.getElementById('locked-button');
    var loc = document.getElementById('locked');
    but.innerHTML = 'test';
    but.onclick = testLocked;
    loc.innerHTML = 'redentials are not locked for user: ' + userName;
    loc.classList.add('locked-text_unlocked');
}

const testLocked = () => {
    var url = backendUrl + 'test-locked?userId=' + userId;
    fetch(url, {
        method: 'GET',
        headers: {token: localStorage.getItem('token')}
    }).then(response => response.json())
    .then(data => {
        if(data.message === 1) {
            setLocked();
        } else {
            setUnlocked();
        }
    })
}

const expandRegister = (el) => {
    document.getElementById('auth-section').style = 'display: block;';
    document.getElementById('new-section').style='display: none;';
    document.getElementById('search-section').style='display:none';
    document.getElementById('users-cont').innerHTML = '';
    
}

const expandCurrent = () => {
    
    document.getElementById('password-section').style = 'display: block;';
    document.getElementById('new-section').style='display: none;';
    document.getElementById('search-section').style='display:none';
    document.getElementById('users-cont').innerHTML = '';
}

const getTableToken = () => {
    // if (userToken.length > 10) {
    //     return userToken;
    // } else {
    //     return localStorage.getItem('token');
    // }
    return localStorage.getItem('token');
}

const register = () => {
    var email = document.getElementById('new-email');
    var password = document.getElementById('new-password');
    var confirmPassword = document.getElementById('confirm-password');
    var name = document.getElementById('new-name');
    var genErr = document.getElementById('reg-error');
    var passErr = document.getElementById('confirm-error');

    genErr.classList.remove('login-form__error_active');
    passErr.classList.remove('login-form__error_active');

    if (password.value === '' || (password.value !== confirmPassword.value)) {
        document.getElementById('confirm-error').classList.add('login-form__error_active');
    } else {
        let emailValue = email.value;
        let passValue = password.value;
        let nameValue = name.value.replace(/ /g, "_");

        if (emailValue.length > 3 && passValue.length > 3 && nameValue.length > 2) {
            showLoader();
                var url = backendUrl + 'register';
                var bod = {
                    email: emailValue,
                    password: passValue,
                    name: nameValue
                }
                fetch(url, {
                    method: 'POST',
                    headers: {
                        token: localStorage.getItem('token')
                    },
                    body: JSON.stringify(bod)
                }).then(response => response.json())
                .then(data => {
                    debugger
                    alert('CREATED: ' + data.create.message + ', UPDATED: ' + data.rename.message + ", UNLOCKED: " + data.unlock.message)
                }).then(() => {
                    cancelRegister();
                    setTimeout(() => document.getElementById('modal').style.display = 'none', 1000) 
                })
            } else {
                document.getElementById('reg-error').classList.add('login-form__error_active');
            }
    }

}

const cancelRegister = () => {
    document.getElementById('search-section').style='display: flex';
    document.getElementById('new-section').style='display: block;';
    document.getElementById('auth-section').style = 'display: none;';
}

const cancelReset = () => {
    document.getElementById('search-section').style='display: flex';
    document.getElementById('new-section').style='display: block;';
    document.getElementById('password-section').style = 'display: none;';
}

const getRandom = (len) => {
    const temp = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPUVWXYZ0123456789";
    const charactersLength = temp.length;
    let result = "";
  
  for (let i = 0; i < length; i++) {
    result += temp.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}

const generatePdf = (dataId) => {
    return new Promise((resolve) => {
 
        var url = backendUrl + "amds-init-file?userId=" + userId + "&fileId=" + dataId;
        fetch(url, {method: 'GET', headers: {token: localStorage.getItem('token')}})
        .then(() => {
            resolve(dataId);
        })
    })
}


const setUserProfile = (uid) => {
    console.log('uid')
    console.log(uid);
    return new Promise((resolve) => {
            let url = backendUrl + 'user-profile?userId=' + uid;
    fetch(url, {
        method: 'GET',
        headers: {
            token: localStorage.getItem('token')
        }
    }).then(response => response.json())
    .then(data => {
        console.log(JSON.stringify(data))
       debugger
        userName = data.id;
        userToken = data.token;
        sessionStorage.setItem('userToken', data.token)
        resolve(true);
    }) 
    })

}

const setUser = (e) => {
    showLoader()
 e.preventDefault();
 let did = getRandom(7);
 //userId = '46';
 userId = e.target.id;
 var source = backendUrl + "files/output_" + did + "_" + userId + ".pdf";
 let ucon = document.getElementById('users-cont');
 ucon.innerHTML = '';
setUserProfile(e.target.id).then(() => {
    
    generatePdf(did)
    .then(() => {
        let emb = document.createElement('embed');
        emb.src = source;
        emb.width = '1200';
        emb.height = '1500';
        emb.type = 'application/pdf';
        ucon.appendChild(emb);
         
    }).then(() => {
        setTimeout(() => document.getElementById('modal').style.display = 'none', 4000) 
    }).then(() => {
        var disbut = document.getElementById('current-user-button');
        disbut.disabled = null;
        disbut.className = "button button_table table__btn font font__title font__title_btn";
    })
})

 

 
}   

const searchUser = (el) => {
    var name = el.value;
    var url = backendUrl + "amds_users?name=" + name;

    fetch(url, 
        {method: 'GET',
        headers: {token: localStorage.getItem('token')}
        }
        ).then(resp => resp.json())
        .then(data => {
            debugger
            let ucon = document.getElementById('users-cont');
            ucon.innerHTML = '';
            data.map((user) => {
                let uid = user.section;
                let uname = user.content;
                let anc = document.createElement('a');
                anc.id = uid;
                anc.href = '#'
                anc.onclick = setUser;
                anc.innerHTML = uname;
                anc.className = 'a-button';
                ucon.appendChild(anc);
            })
        })
}

const setTabButton = (a,stat) => {
    const but = document.getElementById(a);
    let cls = ''
    if (stat === 'visited') {
        cls = 'portal__tab portal__tab_active font font_tab';
    } else if (stat === 'filled') {
        cls =  'portal__tab portal__tab_done font font_tab'
    } else {
        cls = 'portal__tab font font_tab'
    }
    but.setAttribute('class', cls);
}

const clearForm = () => {
    return new Promise((resolve) => {
    let doc = document.getElementById('cont-place');
    let docCont = document.getElementById('cont');
    let buttons = document.getElementById("admin-buttons");
    const cont = doc.querySelector("form[id='" + sheetId + "']");
   
    let admin = docCont.querySelector('#admin-form')
    if (cont instanceof Node) {
        doc.removeChild(cont);
    }
    if (buttons instanceof Node) {
        buttons.style.display='none'
    }
    if (admin instanceof Node) {
        docCont.removeChild(admin)
    }
    
    resolve(true)
    })
}

const getCellNumber = (name, columns) => {
    const cols = columns.split(",");
    for (var i = 0; i < cols.length; i++) {
        if (cols[i] === name) {
            return i;
        }
    }
    return -1;
}

const selectRow = (i) => {
    var rows = document.querySelectorAll("tr.simple_row");
    return rows[i];
}

const getRow = (name) => {

if (name.includes('Philips predefined Exam Card')) {
    console.log(name)
    }
    var escName = name.replace("'", "\\'");
 
    const xpath = "//td[starts-with(normalize-space(), '" 
    + escName 
    + "') and substring(normalize-space(), string-length(normalize-space()) - string-length('" 
    + escName 
    + "') + 1) = '" 
    + escName 
    + "']";
    const row = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
 
    return row.singleNodeValue.parentElement;;
}

const populateRow = (row, object, columns, rowName) => {
 
    var cols = row.getElementsByTagName('td');

    columns.split(",").map(colName => {
        const col = getCellNumber(colName, columns)
        if (col > 0) {
            const colValue = object[colName]
            try {
                const val = (colValue.trim() === 'undefined') ? ' ' : colValue.trim()
                cols[col].getElementsByTagName('input')[0].value = colValue;
                if (colValue === 'y') {
                    cols[col].getElementsByTagName('input')[0].checked = true;
                }
            } catch {
                // console.log('blaming:')
                // console.log(rowName)
            }
            
        }
    })
    
}

const populateTable = () => {
    getColumns().then(columns => {
    var url = backendUrl + 'amds_sheet?id=' + sheetId;
    fetch(url, 
        {method: 'GET',
        //headers: {token: localStorage.getItem('token')}
        headers: {
            token: getTableToken(),
            userToken: sessionStorage.getItem('userToken')
        }
        }
        ).then(resp => resp.json())
        .then(data => data['message'])
        .then(table => {


            localStorage.setItem(sheetId, JSON.stringify(table))
            let ind = 0;
            table.map(object => {
                
                
                const name = object['row_name'];
              //  const row = getRow(name); 
                const spRow = selectRow(ind);
                populateRow(spRow, object, columns, name);
                ind++;

            })
        }) 

    })

} 

const enableUploadButton = () => {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');

    if (fileInput.value) {
      uploadButton.disabled = false;
      uploadButton.style=''
    } else {
      uploadButton.disabled = true;
    }
}

const disableUploadButton = () => {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    fileInput.value = null;
    uploadButton.disabled = true;
 
}

const downloadUser = () => {
 //   let userId = (document.getElementById('user-id') !== null && document.getElementById('user-id') !== undefined) ? document.getElementById('user-id').value : ''
    var url = backendUrl + 'download?head=true&userId=' + userId;
    showLoader()
    fetch(url, {
      method: 'GET',
      headers: { token: localStorage.getItem('token') },
    })
      .then((response) => {
        // Check if response is successful
        if (response.ok) {
          // Extract the filename from Content-Disposition header
          const fileName = 'output_' + userId + '.pdf';
          const contentDisposition = response.headers.get('content-disposition');
          const filename = contentDisposition
            ? contentDisposition
                .split(';')
                .find((part) => part.trim().startsWith('filename='))
                .split('=')[1]
                .trim()
                .replace(/"/g, '')
            : fileName + ".pdf";
  
          // Trigger the file download
          response.blob().then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
          });
        } else {
          // Handle the error case
          console.log('Error downloading the file');
        }
      })
      .then(() => {
        setTimeout(() => document.getElementById('modal').style.display = 'none', 4000) 
      })
      .catch((error) => {
        console.log('Error downloading the file', error);
      });
  };


const download = () => {
    let userId = (document.getElementById('user-id') !== null && document.getElementById('user-id') !== undefined) ? document.getElementById('user-id').value : ''
    var url = backendUrl + 'download?head=true&id=' + sheetId + '&userId=' + userId;
    showLoader()
    fetch(url, {
      method: 'GET',
      headers: { token: localStorage.getItem('token') },
    })
      .then((response) => {
        debugger
        // Check if response is successful
        if (response.ok) {
            debugger
          // Extract the filename from Content-Disposition header
          const fileName = document.querySelector("h3[class='font font__contact']").innerHTML;
          const contentDisposition = response.headers.get('content-disposition');
          const filename = contentDisposition
            ? contentDisposition
                .split(';')
                .find((part) => part.trim().startsWith('filename='))
                .split('=')[1]
                .trim()
                .replace(/"/g, '')
            : fileName + ".xlsx";
  
          // Trigger the file download
          response.blob().then((blob) => {
            debugger
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
          });
        } else {
          // Handle the error case
          console.log('Error downloading the file');
        }
      })
      .then(() => {
        setTimeout(() => document.getElementById('modal').style.display = 'none', 4000) 
      })
      .catch((error) => {
        console.log('Error downloading the file', error);
      });
  };

 

const expandAdmin = () => {
    clearForm().then(() => {
    var url = 'admin.html';
    fetch(url)
    .then((resp => resp.text()))
    .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const cont = doc.querySelector("form[id='admin-form']");
        document.getElementById('cont').appendChild(cont);
    })
    })

}

const pages = {
    "3": "3a",
    "4": "4a",
    "5": "5",
    "6": "6a",
    "7": "7a",
    "8": "8a",
    "9": "9",
    "10": "10a",
    "11": "11a",
    "12": "12a",
    "13": "13",
    "14": "14a",
    "15": "15a",
    "16": "16a",
    "17": "17a",
    "18": "18a",
    "19": "19a",
    "20": "20",
    "21": "21a"
}

const adminNumber = () => {
    return sheetId
}




const userNumber = () => {
    return pages[sheetId]
}

const getHtmlPath = (isAdmin) => {
 
    if (isAdmin === '1') {
        return adminNumber();
    } else {
        return userNumber();
    }
}

const setSheetId = () => {
    return new Promise(resolve => {
        sheetId = 6
        resolve(true)
    })
}

const showTable = () => {
    
    showLoader()
    if (sheetId.length === 0) {
        sheetId = '6'
    }

    getAuthSuper()
    .then((isAdmin) => {



    const url = prefix  
     + getHtmlPath(isAdmin) 
     + ".html";
    fetch(url)
    .then(resp => resp.text())
    .then(data => {
     
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const cont = doc.querySelector("form[id='" + sheetId + "']");
        let container = document.getElementById('cont-place');
        
        container.appendChild(cont);
      
    })
    .then(() => populateTable())
    .then(() => {
        setTimeout(() => document.getElementById('modal').style.display = 'none', 4000) 
        document.getElementById('admin-buttons').style='';
       
    }).then(() => getAuthSuper().then((sta) => {
        if (sta=='1') {
            let portalForm = document.querySelector("form.portal__form");
            let downloadButton = document.createElement('button');
            // let userText = document.createElement('input');
            let idContainer = document.createElement('div');
            let adminButton = document.createElement('li'); 
           
// to remove

            // var uploadForm = document.createElement('form');
            // uploadForm.id = 'uploadForm';
            // uploadForm.enctype = 'multipart/form-data';
    
     
            var fileLabel = document.createElement('label');
            fileLabel.for = 'fileInput';
            fileLabel.textContent = 'Choose a file:';
    
     
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'fileInput';
            fileInput.name = 'fileInput';
            fileInput.accept = '*/*';
    
     
            var lineBreak = document.createElement('br');
    
     
          //  var uploadButton = document.createElement('button');
            // uploadButton.type = 'button';
            // uploadButton.textContent = 'Upload';
            // uploadButton.onclick = uploadFile;  
    
     
            // uploadForm.appendChild(fileLabel);
            // uploadForm.appendChild(fileInput);
            // uploadForm.appendChild(lineBreak);
            // uploadForm.appendChild(uploadButton);


//


            adminButton.id = 'admin_tab';
            adminButton.onclick = expandAdmin
            adminButton.innerHTML = 'Admin portal'
            adminButton.className = "portal__tab font font_tab portal__tab_admin";

            let lastColumn = document.getElementById('last-column');
            if (document.getElementById('admin_tab') === null || document.getElementById('admin_tab') === undefined) {
                lastColumn.appendChild(adminButton);
            }
            
            
            // downloadButton.id = 'download'
            // downloadButton.type = 'button'
            // downloadButton.onclick = downloadUserTable
            // userText.type = 'text'
            // userText.id = 'user-id'
            idContainer.style = 'display: flex;'
            // userText.className = 'login-form__input'
            // userText.style = 'flex: 1; margin-top:22px'
            // downloadButton.className='button button_table table__btn font font__title font__title_btn';
            // downloadButton.innerHTML='Download'
        //    idContainer.append(uploadForm)
           // idContainer.appendChild(userText)
          //  idContainer.appendChild(downloadButton)
         //   portalForm.appendChild(idContainer);
        }
    })).then(() => {
        let caption = document.querySelector("h3[class='font font__contact']");
        if (caption !== null && userName !== undefined && userName.length > 2) {
            caption.innerHTML = caption.innerHTML + " for user: " + userName; 
        }
    })

})

    
}

function uploadFile() {
    
    var input = document.getElementById('fileInput');
    var file = input.files[0];

    if (file) {
        showLoader()
        new Promise((resolve) => {
            var formData = new FormData();
            formData.append('file', file);
            var uploadUrl = backendUrl + 'amds-upload?id=' + sheetId + "&userToken=" + sessionStorage.getItem('userToken');  
    
            var xhr = new XMLHttpRequest();
            xhr.open('POST', uploadUrl, true);
            xhr.setRequestHeader('token', localStorage.getItem('token'))
            var userToken = sessionStorage.getItem('userToken')
            if (userToken) {
                xhr.setRequestHeader('user_token', userToken)
            }
            xhr.onload = function () {
                if (xhr.status === 200) {
                    alert('File uploaded successfully!');
                    resolve('success')

                } else {
                    alert('File upload failed. Please try again.');
                    setTimeout(() => document.getElementById('modal').style.display = 'none', 100) ;
                }
                disableUploadButton();
            };
            
            xhr.send(formData);
            
        })
        .then(() => {
            setTimeout(() => document.getElementById('modal').style.display = 'none', 100) 
            populateTable()
        })
        .then(() => {
            
        })
    } else {
        alert('Please choose a file to upload.');
    }
}

const getColumns = () => {
    return new Promise((resolve) => {
        let url = backendUrl + 'amds_columns?id=' + sheetId;
        let token = localStorage.getItem('token');
        fetch(url, {method: 'GET', headers: {token: token}})
        .then(resp => resp.text())
        .then(data => resolve(data))
    })
}

const showLoader = () => {
    document.getElementById('modal').style.display = 'block';
    document.getElementById('modal').style.top = '10%'
    document.getElementById('modal').style.left = '10%'
    document.getElementById('modal').style.width = "100%"
}

const getAuthSuper = () => {
    return new Promise((resolve) => {
        fetch(backendUrl + 'is-one?head=true', 
        {
        method: 'GET',
        headers: {token: localStorage.getItem('token')}
        })
        .then(resp => resp.text())
        .then(response => {
            resolve(response)
        })
    })
}

const getCellValue = (val, checked, type) => {
    if (val !== null && val !== undefined) {
        if (checked !== null && checked !== undefined && type!== 'text') {
            if (checked === 'true' || checked === true) {
                return 'y'
            } else {
                return (val !== 'y' && val !== 'f') ? val : 'f'
            }
        } else {
            if (val === 'undefined') {
                return ''
            } else {
                return val
            }
        }
    } else {
        return ''
    }
}

const readTable = () => {
    return new Promise((resolve) => {
        getColumns().then((columns) => {
            const rows = document.querySelectorAll('.simple_row');
        
            let array = []
            rows.forEach((row) => {
             const nameFIeld = row.getElementsByTagName('td')[0];   
            const name = nameFIeld.innerText;
            let cellArray = []
            const cells = row.getElementsByTagName('input');
            var colls = columns.split(",");
            let obj = {}
            for (var i = 0; i < colls.length; i++) {
                if (i == 0) {
    
                    obj[colls[i]] = name
                } else {
                    const val = getCellValue(cells[i -1].value, cells[i -1].checked, cells[i-1].type)
                    obj[colls[i]] = (val !== null && val !== undefined && val !== 'undefined') ? val : ' '
          
                }
            }    
             array.push(obj);



        })
        resolve(array)
        })




    })
}

const isFilled = (a) => {
    return fil.includes(a);
}


const downloadAll = () => {
    showLoader()
    let url = backendUrl + "amds-download-all";
    fetch(url, {
        method: 'GET',
        headers: {token: localStorage.getItem('token')}
    })
    .then((response) => {
        if (response.ok) {

            filename = 'dbsnapshot.xlsx';
 
            response.blob().then((blob) => {
      
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              a.click();
            });
          } else {
            // Handle the error case
            console.log('Error downloading the file');
          }
    }).then(() => {
        setTimeout(() => document.getElementById('modal').style.display = 'none', 2000) 
    })
}

const downloadUserTable = () => {
    let userId = (document.getElementById('user-id') !== null && document.getElementById('user-id') !== undefined) ? document.getElementById('user-id').value : ''
    var url = backendUrl + 'amds-download-page?id=' + sheetId;
    showLoader()
    fetch(url, {
      method: 'GET',
      headers: { 
        token: localStorage.getItem('token'),
        userToken: sessionStorage.getItem('userToken')
    },
    })
      .then((response) => {

        // Check if response is successful
        if (response.ok) {

          // Extract the filename from Content-Disposition header
          const fileName = document.querySelector("h3[class='font font__contact']").innerHTML;
          const contentDisposition = response.headers.get('content-disposition');
          const filename = contentDisposition
            ? contentDisposition
                .split(';')
                .find((part) => part.trim().startsWith('filename='))
                .split('=')[1]
                .trim()
                .replace(/"/g, '')
            : fileName + ".xlsx";
  
          // Trigger the file download
          response.blob().then((blob) => {
    
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
          });
        } else {
          // Handle the error case
          console.log('Error downloading the file');
        }
      })
      .then(() => {
        setTimeout(() => document.getElementById('modal').style.display = 'none', 4000) 
      })
      .catch((error) => {
        console.log('Error downloading the file', error);
      });

}

const saveTable = () => {
    
    // document.getElementById('modal').style.display = 'block';
    // document.getElementById('modal').style.top = '20%'
    // document.getElementById('modal').style.left = '0'
    // document.getElementById('modal').style.width = "100%"
    showLoader();
    readTable()
    .then((arr) => {
        let tok = getTableToken();
        let token = localStorage.getItem('token');
        debugger
        if (tok !== null && tok !== undefined && tok.length > 10) {
            token = tok;
        }
        const bod = {
            //token: localStorage.getItem('token'),
            token: token,
            userToken: sessionStorage.getItem('userToken'),
            id: sheetId,
            table: arr
        }
        fetch(backendUrl + 'amds_create_sheet', 
        {method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bod)}).then((resp) => resp.json())
        .then(data => console.log(data))
        .then(() => document.getElementById('modal').style.display = 'none')
        .then(() => {
            debugger
            if (!fil.includes(sheetId)) {
                fil.push(sheetId)
            }
        })
        .then(() => {
            
            document.getElementById(sheetId + '_t').classList.remove('portal__tab_active')
            document.getElementById(sheetId + '_t').classList.add('portal__tab_done')
            setTimeout(() => document.getElementById('modal').style.display = 'none', 1000) 
            debugger
        })

    })
}

const getTableModel = () => {
    return new Promise((resolve, reject) => {
        let url = backendUrl + 'amds-model?id=' + sheetId;
        fetch(url, {
            method: 'GET',
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            resolve(data)
        })
    })
}

const createTableRow = (rowModel, data) => {
    let fieldsModel = data.fields;
    let columnModel = data.fieldsModel; 
    console.log(`this is info or not ${rowModel.info_row}`)
    let tr = document.createElement("tr");
    let rowName = document.createElement("td");
    rowName.innerHTML = rowModel.row_name;
    if (rowModel.info_row == "1") {
        tr.className = "table__bg"
        rowName.className = "table__row";
        let colspan = document.createElement("td");
        colspan.setAttribute("colspan", fieldsModel.split(",").length);
        tr.append(rowName);
        tr.append(colspan)

    } else {
        tr.className = "simple_row"
        rowName.className = "bg-column";
        tr.append(rowName);
        for (let i = 0; i < fieldsModel.split(",").length; i++) {

            let col = document.createElement("td");
            
            let fieldInput = document.createElement("input");
            fieldInput.className = "table__input"
            fieldInput.type = columnModel[fieldsModel.split(",")[i]];
            col.append(fieldInput);
            tr.append(col);

        }
    }
    return tr;
}
 


const generateTable = () => {
    getTableModel()
    .then((data) => {
        let rowModel = data.model;
        let userFields = data.userFields;
        let fieldsModel = data.fieldsModel;
        let fields = data.fields;
        let newTable = data.head;
        let oldTable = document.querySelector("table[class='table font-table']")
        let oldBody = document.querySelector("table[class='table font-table']>tbody")
        oldBody.innerHTML = "";
        oldTable.outerHTML = newTable
 

        console.log(`rowModel value: ${rowModel}`);
        console.log(`userFields value is ${userFields}`);
        console.log(`fieldsModel value is ${fieldsModel}`);
        console.log(`fields value is ${fields}`);
      
        for(let i = 0; i < rowModel.length; i++) {
            let row = rowModel[i]
            tr = createTableRow(row, data);
            console.log(tr.outerHTML)
            oldTable.querySelector("tbody").append(tr);
        }
        // oldTable.querySelector("tbody").innerHTML = body.innerHTML;
        const tbody = document.querySelector("table.table.font-table > tbody");
        const rows = tbody.querySelectorAll("tr");

        rows.forEach(row => row.remove());
        document.querySelector("table[class='table font-table']>tbody").innerHTML = oldTable.querySelector("tbody").innerHTML;
 
    })
}