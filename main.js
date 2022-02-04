var fileList = [];
var curTableHTML = "<table></table>"
function updateFileList() {
    var input = document.getElementById('fileUpload');
    var output = document.getElementById('fileTableDiv');
    curTableHTML = curTableHTML.slice(0,-8); // get rid of </table>
    for (const file of input.files) {
        fileList.push(file);
        curTableHTML += "<tr><td>" + file.name + "</td></tr>";
    }
    curTableHTML += "</table>";
    output.innerHTML = curTableHTML;
}

function clearAll() {
    curTableHTML = "<table></table>";
    output = document.getElementById('fileTableDiv');
    output.innerHTML = curTableHTML;
    fileList = [];
    var checkboxes = document.getElementById('checkboxes');
    checkboxes.innerHTML = "";
}

var events = {}
async function startProcessing() {
    events = {};
    for (const file of fileList) {
        icsFile = await file.text();
        Object.assign(events, parseICS(icsFile));
    }
    genCheckboxes(events);
}

function genCheckboxes() {
    var output = document.getElementById('checkboxes');
    HTML = "";
    for (const [key, _] of Object.entries(events)) {
        nospaceskey = key.replace(/ /g,'');
        // make checkbox, have to remove spaces for id
        HTML += "<div class=\"item\"><input id="+nospaceskey+" type=\"checkbox\" name="+nospaceskey+">"
        HTML += "<label for="+nospaceskey+">"+key+"</label></div>"
    }
    HTML += "<button onclick=\"genFinal()\">Confirm Selection</button>"
    output.innerHTML = HTML;
}

function genFinal() {
    var finaloutput = baseICS(); // just contains boilerplate for start of ics file
    for (const [key, value] of Object.entries(events)) {
        keyBox = document.getElementById(key.replace(/ /g,''));
        if (keyBox.checked) {
            for (const event of value) {
                for (const [k, v] of Object.entries(event)){
                    finaloutput += k+":"+v+"\r\n";
                }
            }
        }
    }
    finaloutput += "END:VCALENDAR\r\n";
    console.log(finaloutput);
    // https://robkendal.co.uk/blog/2020-04-17-saving-text-to-client-side-file-using-vanilla-js
    const a = document.createElement('a');
    const file = new Blob([finaloutput], {type: 'text/plain'});
  
    a.href= URL.createObjectURL(file);
    a.download = "cal.ics";
    a.click();

	URL.revokeObjectURL(a.href);
}
