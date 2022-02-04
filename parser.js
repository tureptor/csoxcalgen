/* parseICS takes an ICS file in the form of a  single string
 * and returns an JSON object containing all VEVENTS within the input
 * It splits the input into lines, then determines the indices of every
 * START:VEVENT and END:VEVENT
 * It then calls getEvents which uses the indices to get the actual VEVENTS
 */
function parseICS(data) {
    const lines = data.split("\r\n");

    var startIndices = [];
    var endIndices = [];

    for (let i = 0; i < lines.length; i++) {
        switch(lines[i]) {
            case "BEGIN:VEVENT":
                startIndices.push(i); break;
            case "END:VEVENT":
                endIndices.push(i); break;
            default:
                break;
        }
    }
    if (startIndices.length != endIndices.length) {
        console.log("Incorrect ICS format");
    }
    return getEvents(lines, startIndices, endIndices);
}


// returns an JSON object of all VEVENTS categorised by course name
function getEvents(lines, starts, ends) {
    allEvents = {};
    // iterate through startIndices/endIndices and parse each VEVENT
    for (let i = 0; i < starts.length; i++) {
        curEvent = {};
        // for each line in the event
        for (const line of lines.slice(starts[i],ends[i]+1)) {
            m = line.match(/(.*):(.*)/); // split x:y into x,y
            curEvent[m[1]] = m[2];
        }
        // append type (lect,prac,class) so we can distinguish within course
        curEvent["SUMMARY"] += " " + curEvent["CATEGORIES"];
        // make array to hold this course if it doesn't exist
        allEvents[curEvent["SUMMARY"]] = allEvents[curEvent["SUMMARY"]] || [];
        allEvents[curEvent["SUMMARY"]].push(curEvent);
    }
    return allEvents;
}
