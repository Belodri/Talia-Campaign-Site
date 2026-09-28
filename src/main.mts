document.addEventListener("DOMContentLoaded", ev => {
   localizeLastUpdatedText();
});

function localizeLastUpdatedText() {
    const ele = document.getElementById("last-updated-date");

    if(!(ele instanceof HTMLTimeElement))
        throw new Error(`Missing element '<time id="last-updated-date">'.`);

    let dateStr = ele.dateTime;
    if(!dateStr.endsWith("Z")) dateStr += "Z";

    const utcDate = new Date(dateStr);
    if(isNaN(utcDate.getTime()))
        throw new Error("Cannot parse 'dateTime' on <time> element.");

    ele.textContent = utcDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
    });
}
