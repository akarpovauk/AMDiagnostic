let sheetId = ''
//let prefix = (document.location.href.includes(local)) ? '' : '/amds/'
//let backendUrl = 'https://test-shmest.com/back/';
const template = "//td[contains(text(), '<name>')]/parent::*/td[<number>]"
  let prefix = ''
  let backendUrl = 'http://localhost:8082/';

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
    const cols = columns.split("'");
    for (var i = 0; i < cols; i++) {
        if (cols[i] === name) {
            return i + 1;
        }
    }
}

const getRow = (name) => {
    const xpath = "//td[contains(text(), '" + name + "')]/parent::*"
    const row = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return row;
}

const populateRow = (row, object, columns) => {
    debugger
    var cols = row.getElementsByTagName('td');

    columns.map(colName => {
        const col = getCellNumber(colName, columns)
        if (col !== 1) {
            cols[col].getElementsByTagName('input').value = object.colName;
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
        .then(data => {
            debugger
            data['message']})
        .then(table => {
            
            console.log(table)
            table.map(object => {
                
                
                const name = object['row_name'];
                const row = getRow(name); 
                populateRow(row, object, columns);

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
    })
}