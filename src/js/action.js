let sheetId = ''
//let prefix = (document.location.href.includes('local')) ? '' : '/amds/'
let prefix = ''
let backendUrl = 'https://amdiagnostic.co.uk/back/';
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
    if (cont instanceof Node) {
        doc.removeChild(cont);
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

// const download = () => {
//     var url = backendUrl + 'download?head=true&id=' + sheetId
//     fetch(url, {
//         method: 'GET',
//         headers: {token: localStorage.getItem('token')}
//     })
// }

const download = () => {
    var url = backendUrl + 'download?head=true&id=' + sheetId;
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
            downloadButton.id = 'download'
            downloadButton.type = 'button'
            downloadButton.onclick=download
            downloadButton.className='button button_table table__btn font font__title font__title_btn';
            downloadButton.innerHTML='Download'
            portalForm.appendChild(downloadButton);
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
    document.getElementById('modal').style.top = '50%'
    document.getElementById('modal').style.left = '50%'
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
    document.getElementById('modal').style.top = '50%'
    document.getElementById('modal').style.left = '50%'
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