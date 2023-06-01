let sheetId = ''
let prefix = (document.location.href.includes('local')) ? '' : '/amds/'
let backendUrl = 'https://test-shmest.com/back/';
const template = "//td[contains(text(), '<name>')]/parent::*/td[<number>]"
//   let prefix = ''
//   let backendUrl = 'http://localhost:8082/';

const expand = (a) => {
    clearForm().then((anc) => {
    sheetId = (a.replace('_t', ''))
  
    showTable();
    })

 return sheetId;
}

const clearForm = () => {
    return new Promise((resolve) => {
    let doc = document.getElementById('portal')
    const cont = doc.querySelector("form[id='" + sheetId + "']");
    doc.removeChild(cont);
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
                cols[col].getElementsByTagName('input')[0].value = colValue;
            } catch {
                console.log('blaming:')
                console.log(rowName)
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

const showTable = () => {
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
        document.getElementById('portal').appendChild(cont);
    })
    .then(() => populateTable())
}

const getColumns = () => {
    return new Promise((resolve) => {
        let url = backendUrl + 'amds_columns?id=' + sheetId;
        fetch(url, {method: 'GET', headers: {token: localStorage.getItem('token')}})
        .then(resp => resp.text())
        .then(data => resolve(data))
    })
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
                    obj[colls[i]] = cells[i -1].value
                }
            }    
             array.push(obj);



        })
        resolve(array)
        })




    })
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
    })
}