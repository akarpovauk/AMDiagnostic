let sheetId = ''
let userId = ''
let prefix = ''
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

const generatePdf = (id) => {
    return new Promise((resolve) => {
        var url = backendUrl + "amds-init-file?userId=" + userId;
        fetch(url, {method: 'GET', headers: {token: localStorage.getItem('token')}})
        .then(() => {
            resolve(true);
        })
    })
}

const setUser = (e) => {
    showLoader()
 e.preventDefault();
 //userId = '46';
 userId = e.target.id;
 var source = backendUrl + "files/output_" + userId + ".pdf";
 let ucon = document.getElementById('users-cont');
 ucon.innerHTML = '';




generatePdf()
.then(() => {
    let emb = document.createElement('embed');
    emb.src = source;
    emb.width = '1200';
    emb.height = '1500';
    emb.type = 'application/pdf';
    ucon.appendChild(emb);
}).then(() => {
    setTimeout(() => document.getElementById('modal').style.display = 'none', 4000) 
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
    let doc = document.getElementById('cont')
    const cont = doc.querySelector("form[id='" + sheetId + "']");
    let admin = doc.querySelector('#admin-form')
    if (cont instanceof Node) {
        doc.removeChild(cont);
    }
    if (admin instanceof Node) {
        doc.removeChild(admin)
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

const getRow = (name) => {

if (name.includes('Philips predefined Exam Card')) {
    console.log(name)
}

    //const xpath = "//td[contains(text(), '" + name + "')]/parent::*"
    const xpath = "//td[starts-with(normalize-space(), '" 
    + name 
    + "') and substring(normalize-space(), string-length(normalize-space()) - string-length('" 
    + name 
    + "') + 1) = '" 
    + name 
    + "']";
    const row = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    // if (name.includes("Exam Card")) {
    //     console.log(row.getElementsByTagName("td")[0].innerText)
    // }
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
        headers: {token: localStorage.getItem('token')}
        }
        ).then(resp => resp.json())
        .then(data => data['message'])
        .then(table => {

            console.log(table)
            table.map(object => {
                
                
                const name = object['row_name'];
                const row = getRow(name); 
                populateRow(row, object, columns, name);

            })
        }) 

    })

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
        // Check if response is successful
        if (response.ok) {
          // Extract the filename from Content-Disposition header
          const fileName = document.querySelector("h3[class='font font__title font__title_portal']").innerHTML;
          const contentDisposition = response.headers.get('content-disposition');
          const filename = contentDisposition
            ? contentDisposition
                .split(';')
                .find((part) => part.trim().startsWith('filename='))
                .split('=')[1]
                .trim()
                .replace(/"/g, '')
            : fileName + ".xls";
  
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

 

const expandAdmin = () => {
    clearForm();
    var url = 'admin.html';
    fetch(url)
    .then((resp => resp.text()))
    .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const cont = doc.querySelector("form[id='admin-form']");
        document.getElementById('cont').appendChild(cont);
    })
}

const showTable = () => {
    showLoader()
    if (sheetId.length === 0) {
        sheetId = '6'
    }
    const url = prefix + sheetId + ".html";
    fetch(url)
    .then(resp => resp.text())
    .then(data => {
     
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const cont = doc.querySelector("form[id='" + sheetId + "']");
        document.getElementById('cont').appendChild(cont);
    })
    .then(() => populateTable())
    .then(() => {
        setTimeout(() => document.getElementById('modal').style.display = 'none', 4000) 
    }).then(() => getAuthSuper().then((sta) => {
        if (sta=='1') {
            let portalForm = document.querySelector("form.portal__form");
            let downloadButton = document.createElement('button');
            let userText = document.createElement('input');
            let idContainer = document.createElement('div');
            let adminButton = document.createElement('li');
            adminButton.id = 'admin_tab';
            adminButton.onclick = expandAdmin
            adminButton.innerHTML = 'Admin portal'
            adminButton.className = "portal__tab font font_tab portal__tab_admin";

            let lastColumn = document.getElementById('last-column');
            if (document.getElementById('admin_tab') === null || document.getElementById('admin_tab') === undefined) {
                lastColumn.appendChild(adminButton);
            }
            
            
            downloadButton.id = 'download'
            downloadButton.type = 'button'
            downloadButton.onclick = download
            userText.type = 'text'
            userText.id = 'user-id'
            idContainer.style = 'display: flex;'
            userText.className = 'login-form__input'
            userText.style = 'flex: 1; margin-top:22px'
            downloadButton.className='button button_table table__btn font font__title font__title_btn';
            downloadButton.innerHTML='Download'
            idContainer.appendChild(userText)
            idContainer.appendChild(downloadButton)
            portalForm.appendChild(idContainer);
        }
    }))
    
}

const getColumns = () => {
    return new Promise((resolve) => {
        let url = backendUrl + 'amds_columns?id=' + sheetId;
        fetch(url, {method: 'GET', headers: {token: localStorage.getItem('token')}})
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

const getCellValue = (val, checked) => {
    if (val !== null && val !== undefined) {
        if (checked !== null && checked !== undefined) {
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
                    const val = getCellValue(cells[i -1].value, cells[i -1].checked)
                    obj[colls[i]] = (val !== null && val !== undefined && val !== 'undefined') ? val : ' '
                    debugger
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

const saveTable = () => {
    
    document.getElementById('modal').style.display = 'block';
    document.getElementById('modal').style.top = '20%'
    document.getElementById('modal').style.left = '0'
    document.getElementById('modal').style.width = "100%"
    readTable()
    .then((arr) => {
        const bod = {
            token: localStorage.getItem('token'),
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
            if (!fil.includes(sheetId)) {
                fil.push(sheetId)
            }
        })
        .then(() => {
            
            document.getElementById(sheetId + '_t').classList.remove('portal__tab_active')
            document.getElementById(sheetId + '_t').classList.add('portal__tab_done')
        })
    })
}