let sheetId = ''

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

const showTable = () => {
    if (sheetId.length === 0) {
        sheetId = '6'
    }
    const url = '/amds/' + sheetId + ".html";
    fetch(url)
    .then(resp => resp.text())
    .then(data => {
        debugger
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const cont = doc.querySelector("form[id='" + sheetId + "']");
        document.getElementById('portal').appendChild(cont);
    })
}