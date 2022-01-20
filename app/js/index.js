// Default Coords
let overworldCoords = netherCoords = [0, 64, 0];

// Creates A Save Item On Local Storage
if (!window.localStorage.getItem("coordSaves")) { localStorage.setItem("coordSaves", JSON.stringify([])) };

// Sets Preferences On Local Storage
if (!window.localStorage.getItem("hideIllustrations")) { localStorage.setItem("hideIllustrations", JSON.stringify(false)) };

// Gets Saves From Local Storage
let data = JSON.parse(window.localStorage.getItem("coordSaves"));

// Check For Previous Saves And Appends Them
$(document).ready(async function () {
    if (JSON.parse(localStorage.getItem("hideIllustrations"))) {
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
        localStorage.setItem("hideIllustrations", JSON.stringify(true))
        $("img").animate({
            opacity: 0
        }, 500, function () {
            $(this).slideUp("fast");
            $(".img__spacing").slideDown("fast");
            $("#control__arrows").removeClass("mt-28");
        })
    } else {
        localStorage.setItem("hideIllustrations", JSON.stringify(false))
        $("img").slideDown("fast", function () {
            $(this).animate({
                opacity: 1
            }, 500);
        });
        $(".img__spacing").slideUp("fast");
        $("#control__arrows").addClass("mt-28");
    }
});

// Calculates Overworld And Nether Coords On Input
$("input").on("input", function (e) {
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
    overworldCoords = [$("#overworld-x").val(), $("#overworld-y").val(), $("#overworld-z").val()];
    netherCoords = [$("#nether-x").val(), $("#nether-y").val(), $("#nether-z").val()];
});

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
    $("#form__input").val(`Coords#${data.length + 1}`);
    $("#form__input").focus();
});

// Closes Title Input
$("#title__backdrop").click(function (e) {
    $("#form__input").val("");
    $("#main__title").addClass("hidden");
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
function saveCoords(saveTitle) {
    // Creates New Save Object
    const newSave = {
        id: data.length,
        title: saveTitle,
        overworldCoords: [$("#overworld-x").val(), $("#overworld-y").val(), $("#overworld-z").val()],
        netherCoords: [$("#nether-x").val(), $("#nether-y").val(), $("#nether-z").val()]
    }

    // Adds Object To Array
    localStorage.setItem("coordSaves", JSON.stringify([...data, newSave]));
    alertMe("Your Coords Have Been Saved");

    // Gets New Array
    data = JSON.parse(window.localStorage.getItem("coordSaves"));
    renderSaves(data);
}

// Renders Saved Coordinates
function renderSaves(data) {
    $("#saved__data").empty();
    for (let save of data) {
        $("#saved__data").append(`
            <div class="flex items-center justify-between w-full py-4 pl-8 pr-4 ring-4 ring-zinc-900 border-4 border-t-zinc-200 border-l-zinc-200 border-r-zinc-600 border-b-zinc-600 bg-zinc-300 text-stone-700">
            <h3 class="font-minecraft text-xl">${save.title}</h3>
            <div class="flex gap-6">
                <div class="flex items-center gap-2 ring-4 px-8 h-14 ring-zinc-900 border-4 border-t-zinc-200 border-l-zinc-200 border-r-zinc-600 border-b-zinc-600 bg-zinc-300">
                    <h4 class="font-minecraft text-lg text-stone-700 mr-2">Overworld</h4>
                    <h5 class="font-minecraft text-stone-700"><span class="text-stone-500">X: </span>${save.overworldCoords[0]}</h5>
                    <h5 class="font-minecraft text-stone-700"><span class="text-stone-500">Y: </span>${save.overworldCoords[1]}</h5>
                    <h5 class="font-minecraft text-stone-700"><span class="text-stone-500">Z: </span>${save.overworldCoords[2]}</h5>
                </div>
                <div class="flex items-center gap-2 ring-4 px-8 h-14 ring-zinc-900 border-4 border-t-zinc-200 border-l-zinc-200 border-r-zinc-600 border-b-zinc-600 bg-zinc-300">
                    <h4 class="font-minecraft text-lg text-stone-700 mr-2">Nether</h4>
                    <h5 class="font-minecraft text-stone-700"><span class="text-stone-500">X: </span>${save.netherCoords[0]}</h5>
                    <h5 class="font-minecraft text-stone-700"><span class="text-stone-500">Y: </span>${save.netherCoords[1]}</h5>
                    <h5 class="font-minecraft text-stone-700"><span class="text-stone-500">Z: </span>${save.netherCoords[2]}</h5>
                </div>
            </div>
        </div>`);
    }
}

// Resets Coords To Default Values
$("#control__reset").click(function (e) {
    e.preventDefault();
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
    navigator.clipboard.writeText(overworldCoords.join(", "));
    alertMe("Overworld Coords Copied");
});

// Copies Nether Coords To Clipboard
$("#nether__copy").click(function (e) {
    e.preventDefault();
    navigator.clipboard.writeText(netherCoords.join(", "));
    alertMe("Nether Coords Copied");
});

async function alertMe(message) {
    if (!$("#header__alert").hasClass("hidden")) {
        $("#header__alert").addClass("hidden -top-full");
        $("#header__alert").removeClass("top-12");
    }
    $("#alert__message").text(message);
    $("#header__alert").removeClass("hidden -top-full");
    $("#header__alert").addClass("top-12");
    await sleep(3000);
    $("#header__alert").addClass("hidden -top-full");
    $("#header__alert").removeClass("top-12");
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}