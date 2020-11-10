import MenuItem from './MenuItem';
import ExportModal from './modals/ExportModal';

export var tracks = [
    {
        "track": "build/music_superposition.mp3",
        "data": "build/data_superposition.json",
        "name": "Extrawelt - Superposition"
    },
    {
        "track": "build/music_cutmedown.mp3",
        "data": "build/data_cutmedown.json",
        "name": "Sasha - Cut Me Down"
    },
    {
        "track": "build/music_odysee.mp3",
        "data": "build/data_odysee.json",
        "name": "Stephan Bodzin - Odysee"
    }
]

function get_current_track() {
    const audioElement = document.getElementById("music");
    audioElement.pause();
    var source = audioElement.getElementsByTagName("source");

    source[0].src;
}

export function set_current_track_name(current_track) {

    var current_track_elem = document.getElementById("current_track");

    current_track_elem.innerHTML = ' <i class="material-icons">play_arrow</i> Current Track: ' + current_track;
}

// define a handler
function document_key_up(e) {
    // this would test for whichever key is 40 and the ctrl key at the same time
    if (e.altKey && e.keyCode === 82) {
        console.error("HOTKEY" + window.glslEditor);
        window.glslEditor.update();
    }
}
// register the handler
document.addEventListener('keyup', document_key_up, false);

document.addEventListener('mouseup', (e) =>
{
    var container = document.getElementsByClassName("dropdown-content"); // Give you class or ID

    if (!container[0].contains(e.target))
    {
        container[0].style.display = "none";
    }
});

export default class Menu {
    constructor (main) {
        this.main = main;
        this.menus = {};

        // CREATE MENU Container
        this.el = document.createElement('ul');
        this.el.setAttribute('class', 'ge_menu_bar');

        // NEW
        this.menus.new = new MenuItem(this.el, 'ge_menu', '<i class="material-icons">add</i> New', (event) => {
            main.new();
        });

        // OPEN
        this.fileInput = document.createElement('input');
        this.fileInput.setAttribute('type', 'file');
        this.fileInput.setAttribute('accept', 'text/x-yaml');
        this.fileInput.style.display = 'none';
        this.fileInput.addEventListener('change', (event) => {
            main.open(event.target.files[0]);
        });
        this.menus.open = new MenuItem(this.el, 'ge_menu', '<i class="material-icons">folder_open</i>  Open', (event) => {
            this.fileInput.click();
        });

        // this.track_picker = document.createElement();
        this.menus.track = new MenuItem(this.el, 'ge_menu', '<i class="material-icons">library_music</i>  Track', (event) => {
            var elements = document.getElementsByClassName("dropdown-content");

            if (elements[0].style.display == "block")
            {
                elements[0].style.display = "none";
            }
            else if(elements[0].style.display = "none")
            {
                elements[0].style.display = "block";
            }

        });

        // this.menus.track.button.addEventListener('focusout', function(e){
        //     var elements = document.getElementsByClassName("dropdown-content");
        //     elements[0].style.display = "none";
        // });

        var dropdown_div = document.createElement("div");
        dropdown_div.className = "dropdown-content";

        for (var track in tracks)
        {
            console.error(track);
            var track_dropdown_div = document.createElement("div");
            track_dropdown_div.className = "track"
            track_dropdown_div.innerHTML = tracks[track].name;

            var track_name_div = document.createElement("div");
            track_name_div.innerHTML = tracks[track].name;
            track_name_div.className = "track_name";
            track_name_div.style.display = "none";

            var track_audio_div = document.createElement("div");
            track_audio_div.innerHTML = tracks[track].track;
            track_audio_div.className = "track_audio";
            track_audio_div.style.display = "none";

            var track_data_div = document.createElement("div");
            track_data_div.innerHTML = tracks[track].data;
            track_data_div.className = "track_data";
            track_data_div.style.display = "none";

            track_dropdown_div.appendChild(track_audio_div);
            track_dropdown_div.appendChild(track_data_div);
            track_dropdown_div.appendChild(track_name_div);

            track_dropdown_div.addEventListener('click', (event) => {
                console.error(event.target);

                var elements = document.getElementsByClassName("dropdown-content");
                elements[0].style.display = "none";

                const audioElement = document.getElementById("music")

                var track_name_elem = event.target.getElementsByClassName("track_name");
                var track_data_elem = event.target.getElementsByClassName("track_data");
                var track_audio_elem = event.target.getElementsByClassName("track_audio");

                console.error(track_data_elem);
                console.error(track_audio_elem);

                audioElement.dispatchEvent(new CustomEvent("change_track", {
                    "detail": {
                        "track_data": track_data_elem[0].innerHTML,
                        "track_audio": track_audio_elem[0].innerHTML,
                        "track_name": track_name_elem[0].innerHTML
                    }
                }));

                // event.stopPropagation();
            }, true);

            dropdown_div.appendChild(track_dropdown_div);

            this.menus.track.el.appendChild(dropdown_div);
        }

        // AUTOUPDATE
        this.menus.autoupdate = new MenuItem(this.el, 'ge_menu', ' <i class="material-icons">autorenew</i> Update: ON', (event) => {
            if (main.autoupdate) {
                main.autoupdate = false;
                this.menus.autoupdate.name = '<i class="material-icons">autorenew</i> Update: OFF';
                // this.menus.autoupdate.button.style.color = 'gray';
            }
            else {
                main.autoupdate = true;
                main.update();
                this.menus.autoupdate.name = '<i class="material-icons">autorenew</i> Update: ON';
                // this.menus.autoupdate.button.style.color = 'white';
            }
        });

        this.menus.current_track = new MenuItem(
            this.el,
            'ge_menu',
            ' <i class="material-icons">play_arrow</i> Current Track: ' ,
            (event) => {}
            );

        this.menus.current_track.button.id = "current_track";
        main.container.appendChild(this.el);
    }
}
