document.addEventListener("DOMContentLoaded", ev => {
   localizeLastUpdatedText();
   registerDropdownMenuListeners();
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


function registerDropdownMenuListeners() {
    for (const dropdown of document.querySelectorAll<HTMLDetailsElement>("details.dropdown")) {
        dropdown.addEventListener("focusout", ev => {
            if (!dropdown.contains(ev.relatedTarget as Node | null)) dropdown.open = false;
        });
        
        dropdown.addEventListener("click", ev => {
            if ((ev.target as Element).closest("a")) dropdown.open = false;
        });

        dropdown.addEventListener("pointerenter", ev => {
            // Touch taps fire pointerenter too, and the click that follows would toggle it straight back closed.
            if (ev.pointerType === "mouse") dropdown.open = true;
        });

        dropdown.addEventListener("pointerleave", ev => {
            if (ev.pointerType === "mouse") dropdown.open = false;
        });
    }
}
