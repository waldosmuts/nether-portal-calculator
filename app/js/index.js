// Default Coords
let overworldCoords = netherCoords = [0, 64, 0];

// Creates A Save Item On Local Storage
if (!window.localStorage.getItem("coordSaves")) { window.localStorage.setItem("coordSaves", JSON.stringify([])) };

// Sets Preferences On Local Storage
if (!window.localStorage.getItem("hideIllustrations")) { window.localStorage.setItem("hideIllustrations", JSON.stringify(false)) };

// Sets Save ID On Local Storage
if (!window.localStorage.getItem("saveID")) { window.localStorage.setItem("saveID", JSON.stringify(0)) };

// Gets Saves From Local Storage
let data = JSON.parse(window.localStorage.getItem("coordSaves"));

// Delete Modal Selection
let deleteSave = null;

// ID Counter
let saveID = JSON.parse(window.localStorage.getItem("saveID"));

// Check For Previous Saves And Appends Them
$(document).ready(async function () {
    if (JSON.parse(window.localStorage.getItem("hideIllustrations"))) {
        $("img").css("opacity", 0);
        $("img").hide();
        $(".img__spacing").show();
        $("#control__arrows").removeClass("mt-28");
    }
    if (data.length) {
        renderSaves(data);
    } else {
        $("#saved__data").append(`<div id="data__none" class="font-minecraft text-white text-xl">No Saved Coordinates Found</div>`);
    }
    await sleep(3000);
    $("header").addClass("active");
});

// Hides Illustrations And Saves Preference
$("#hide-illustrations").click(function (e) {
    if ($("img").css("display") !== "none") {
        window.localStorage.setItem("hideIllustrations", JSON.stringify(true))
        $("img").animate({
            opacity: 0
        }, 500, function () {
            $(this).slideUp("fast");
            $(".img__spacing").slideDown("fast");
            $("#control__arrows").removeClass("mt-28");
        })
    } else {
        window.localStorage.setItem("hideIllustrations", JSON.stringify(false))
        $("img").slideDown("fast", function () {
            $(this).animate({
                opacity: 1
            }, 500);
            $("#control__arrows").addClass("mt-28");
        });
        $(".img__spacing").slideUp("fast");
    }
});

// Clears Input If It Contains The Default Coords
$("input").on("focus", async function (e) {
    e.preventDefault();
    if ($(this).val() === $(this).attr("placeholder")) {
        $(this).val("");
    }
});

// Stores Inteval
let glowInterval;

// Calculates Overworld And Nether Coords On Input
$("input").on("input", async function (e) {
    e.preventDefault();
    switch ($(this).attr("id")) {
        case $("#overworld-x").attr("id"):
            $("#nether-x").val(Math.floor($(this).val() / 8))
            break;
        case $("#overworld-y").attr("id"):
            $("#nether-y").val($(this).val())
            break;
        case $("#overworld-z").attr("id"):
            $("#nether-z").val(Math.floor($(this).val() / 8))
            break;
        case $("#nether-x").attr("id"):
            $("#overworld-x").val($(this).val() * 8)
            break;
        case $("#nether-y").attr("id"):
            $("#overworld-y").val($(this).val())
            break;
        case $("#nether-z").attr("id"):
            $("#overworld-z").val($(this).val() * 8)
            break;

        default:
            break;
    }
    clearInterval(glowInterval);
    glowInterval = setInterval(removeGlow, 750);
    if (!$("#arrows__glyphs").hasClass("glyph-glow")) {
        $("#arrows__glyphs").addClass("text-purple-500 glyph-glow");
        $("#arrows__glyphs").removeClass("opacity-50");
    }
    function removeGlow() {
        $("#arrows__glyphs").removeClass("text-purple-500 glyph-glow");
        $("#arrows__glyphs").addClass("opacity-50");
    }

    // Saves Coords To Global Variables
    overworldCoords = [$("#overworld-x").val(), $("#overworld-y").val(), $("#overworld-z").val()];
    netherCoords = [$("#nether-x").val(), $("#nether-y").val(), $("#nether-z").val()];
});

// Sets Coord To Default If Empty
$("input").on("focusout", function () {
    if ($(this).val() === "") {
        $(this).val($(this).attr("placeholder"));
    }
})

// Prevents Page From Reloading
$("#main__form").submit(function (e) { e.preventDefault(); });

// Shows Title Input
$("#control__save").click(function (e) {
    e.preventDefault();
    $("#main__title").removeClass("hidden");
    $("#form__input").val(`Coords#${saveID}`);
    $("#form__input").focus();
});

// Closes Title Input
$("#title__backdrop, #confirmation__backdrop").click(function (e) {
    $("#form__input").val("");
    if (!$("#main__title").hasClass("hidden")) {
        $("#main__title").addClass("hidden");
    }
    if (!$("#saved__confirmation").hasClass("hidden")) {
        $("#saved__confirmation").addClass("hidden");
    }
});

// Send Coords To saveCoords()
$("#title__form").submit(function (e) {
    e.preventDefault();
    if ($("#form__input").val() === "") {
        return;
    }
    $("#main__title").addClass("hidden");
    saveCoords($("#form__input").val());
});

// Saves Coords To Local Storage
async function saveCoords(saveTitle) {
    // Creates New Save Object
    const newSave = {
        id: saveID,
        title: saveTitle,
        overworldCoords: [$("#overworld-x").val(), $("#overworld-y").val(), $("#overworld-z").val()],
        netherCoords: [$("#nether-x").val(), $("#nether-y").val(), $("#nether-z").val()]
    }

    // Adds Object To Array
    window.localStorage.setItem("coordSaves", JSON.stringify([...data, newSave]));

    // Gets New Array
    data = JSON.parse(window.localStorage.getItem("coordSaves"));
    renderSaves(data);

    ++saveID;
    window.localStorage.setItem("saveID", JSON.stringify(saveID));

    $("#control__save").text("Saved");
    await sleep(1000);
    $("#control__save").text("Save Coords");
}

// Renders Saved Coordinates
function renderSaves(data) {
    $("#saved__data").empty();
    let saveTitle;
    if (data.length) {
        for (let save of data) {
            if (save.title.length > 15) {
                saveTitle = `${save.title.slice(0, 15)}...`;
            } else {
                saveTitle = save.title;
            }
            $("#saved__data").append(`
                <div id="${save.id}" class="data__save flex items-center justify-between w-full py-4 pl-8 pr-4 ring-4 ring-zinc-900 border-4 border-t-zinc-200 border-l-zinc-200 border-r-zinc-600 border-b-zinc-600 bg-zinc-300 text-stone-700">
                    <h3 class="font-minecraft text-xl">${saveTitle}<span class="font-glyph ml-4 opacity-50">${save.title.replace(/[^A-z\s][\\\^\d]?/, "").slice(0, 10)}</span></h3>
                    <div class="flex gap-6">
                        <div onclick="copySavedCoords(${save.overworldCoords.join(", ")})" class="data__coords flex items-center gap-2 px-4 h-14 cursor-pointer hover:text-white ring-4 ring-zinc-900 border-4 border-t-zinc-200 border-l-zinc-200 border-r-zinc-600 border-b-zinc-600 hover:border-t-zinc-600 hover:border-r-zinc-200 hover:border-b-zinc-200 hover:border-l-zinc-600 bg-zinc-300 hover:bg-zinc-400 font-minecraft text-stone-700">
                            <h4 class="text-lg mr-2">Overworld</h4>
                            <h5><span class="opacity-50">X: </span>${save.overworldCoords[0]}</h5>
                            <h5><span class="opacity-50">Y: </span>${save.overworldCoords[1]}</h5>
                            <h5><span class="opacity-50">Z: </span>${save.overworldCoords[2]}</h5>
                        </div>
                        <div onclick="copySavedCoords(${save.netherCoords.join(", ")})" class="data__coords flex items-center gap-2 px-4 h-14 cursor-pointer hover:text-white ring-4 ring-zinc-900 border-4 border-t-zinc-200 border-l-zinc-200 border-r-zinc-600 border-b-zinc-600 hover:border-t-zinc-600 hover:border-r-zinc-200 hover:border-b-zinc-200 hover:border-l-zinc-600 bg-zinc-300 hover:bg-zinc-400 font-minecraft text-stone-700">
                            <h4 class="text-lg mr-2">Nether</h4>
                            <h5><span class="opacity-50">X: </span>${save.netherCoords[0]}</h5>
                            <h5><span class="opacity-50">Y: </span>${save.netherCoords[1]}</h5>
                            <h5><span class="opacity-50">Z: </span>${save.netherCoords[2]}</h5>
                        </div>
                        <button class="save__delete h-14 w-14 p-3 hover:fill-white ring-4 ring-zinc-900 border-4 border-t-zinc-200 border-l-zinc-200 border-r-zinc-600 border-b-zinc-600 hover:border-t-zinc-600 hover:border-r-zinc-200 hover:border-b-zinc-200 hover:border-l-zinc-600 bg-zinc-300 hover:bg-zinc-400 font-minecraft fill-stone-700">
                            <svg class="m-px" viewBox="0 0 130 130" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path opacity="1.00" d=" M 40.00 0.00 L 70.00 0.00 C 70.00 3.33 70.00 6.67 70.00 10.00 C 60.00 10.00 50.00 10.00 40.00 10.00 C 40.00 6.67 40.00 3.33 40.00 0.00 Z" />
                                    <path opacity="1.00" d=" M 0.00 20.00 C 36.67 20.00 73.33 20.00 110.00 20.00 C 110.00 23.33 110.00 26.67 110.00 30.00 C 73.33 30.00 36.67 30.00 0.00 30.00 L 0.00 20.00 Z" />
                                    <path opacity="1.00" d=" M 10.00 40.00 C 40.00 40.00 70.00 40.00 100.00 40.00 C 100.00 70.00 100.00 100.00 100.00 130.00 L 10.00 130.00 C 10.00 100.00 10.00 70.00 10.00 40.00 M 30.00 60.00 C 30.00 76.67 30.00 93.33 30.00 110.00 C 33.33 110.00 36.67 110.00 40.00 110.00 C 40.00 93.33 40.00 76.67 40.00 60.00 C 36.67 60.00 33.33 60.00 30.00 60.00 M 50.00 60.00 C 50.00 76.67 50.00 93.33 50.00 110.00 C 53.33 110.00 56.67 110.00 60.00 110.00 C 60.00 93.33 60.00 76.67 60.00 60.00 C 56.67 60.00 53.33 60.00 50.00 60.00 M 70.00 60.00 C 70.00 76.67 70.00 93.33 70.00 110.00 C 73.33 110.00 76.67 110.00 80.00 110.00 C 80.00 93.33 80.00 76.67 80.00 60.00 C 76.67 60.00 73.33 60.00 70.00 60.00 Z" />
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>`);
        }
    } else {
        $("#saved__data").append(`<div id="data__none" class="font-minecraft text-white text-xl">No Saved Coordinates Found</div>`);
    }
    $(".data__coords").click(async function (e) {
        const content = $(this).html();
        $(this).html(`
            <span class="font-glyph mr-2 opacity-50">xyz</span>
            <span class="text-lg">Copied</span>
            <span class="font-glyph ml-2 opacity-50">cop</span>`);
        await sleep(1000);
        $(this).html(content);
    });
    $(".save__delete").click(function (e) {
        deleteSave = parseInt($(this).parents(".data__save").attr("id"));
        $("#saved__confirmation").removeClass("hidden");
    });
}

// Removes Save From Local Storage And Re-Renders
$("#modal__confirm").click(async function (e) {
    $("#saved__confirmation").addClass("hidden");
    const saves = await JSON.parse(window.localStorage.getItem("coordSaves"));
    for (let i = 0; i < saves.length; i++) {
        if (saves[i].id === deleteSave) {
            saves.splice(i, 1);
            window.localStorage.setItem("coordSaves", JSON.stringify(saves));
            deleteSave = null;

            // Gets New Array
            data = await JSON.parse(window.localStorage.getItem("coordSaves"));
            renderSaves(data);
        }
    }
});

// Hides Delete Modal
$("#modal__cancel").click(function (e) {
    $("#saved__confirmation").addClass("hidden");
});

// Resets Coords To Default Values
$("#control__reset").click(async function (e) {
    e.preventDefault();
    const string = "Coords Reset";
    $(this).text("");
    $(this).removeClass("font-minecraft");
    $(this).addClass("font-glyph");
    for (let char of string) {
        $(this).text(`${$(this).text()}${char}`);
        await sleep(50);
    }
    $(this).text("Reset");
    $(this).removeClass("font-glyph");
    $(this).addClass("font-minecraft");
    $("#overworld-x").val(0);
    $("#overworld-y").val(64);
    $("#overworld-z").val(0);
    $("#nether-x").val(0);
    $("#nether-y").val(64);
    $("#nether-z").val(0);
});

// Copies Overworld Coords To Clipboard
$("#overworld__copy").click(function (e) {
    e.preventDefault();
    alertCopy(this);
    navigator.clipboard.writeText(overworldCoords.join(", "));
});

// Copies Nether Coords To Clipboard
$("#nether__copy").click(function (e) {
    e.preventDefault();
    alertCopy(this);
    navigator.clipboard.writeText(netherCoords.join(", "));
});

async function alertCopy(el) {
    const copyText = $(el).children(".copy__text").text()
    $(el).children(".copy__text").text("Copied");
    await sleep(1000);
    $(el).children(".copy__text").text(copyText);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function copySavedCoords(x, y, z) {
    navigator.clipboard.writeText(`${x}, ${y}, ${z}`);
}