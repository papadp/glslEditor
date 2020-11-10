import GlslCanvas from 'glslCanvas';
import { subscribeInteractiveDom } from '../tools/interactiveDom';
import MediaCapture from '../tools/mediaCapture';
import MenuItem from '../ui/MenuItem';
// 3er Parties
import { saveAs } from '../vendor/FileSaver.min.js';
import { set_current_track_name, tracks } from '../ui/Menu';

var CONTROLS_CLASSNAME = 'ge_control';
var CONTROLS_PANEL_CLASSNAME = 'ge_control_panel';

var wavesurfer = null;
var context = new AudioContext();

var trackTimesUpdateInterval = null;

function updateTrackTimes() {
    if (wavesurfer != null) {
        var trackCurrentTime = wavesurfer.getCurrentTime();
        var trackDuration = wavesurfer.getDuration();

        setTrackTimes(trackCurrentTime, trackDuration);
    }
    else
    {
        setTrackTimes(0, 0);
    }
}

function setTrackTimes(currentTime, totalDuration) {

    var trackTimesLabel = document.getElementById('track-times-label');

    var minutesCurrentTime = String(Math.floor(currentTime / 60)).padStart(2, '0');
    var secondsCurrentTime = String(Math.round(currentTime % 60)).padStart(2, '0');

    var minutesTotalDuration = String(Math.floor(totalDuration / 60)).padStart(2, '0');
    var secondsTotalDuration = String(Math.round(totalDuration % 60)).padStart(2, '0');

//    String(input).padStart(2, '0');

    trackTimesLabel.innerHTML = `${minutesCurrentTime}:${secondsCurrentTime} / ${minutesTotalDuration}:${secondsTotalDuration}`;

}

function playButton() {
    console.error("play click")
    wavesurfer.play();
    enablePause();
}

function pauseButton() {
    console.error("pause click")
    wavesurfer.pause();
    enablePlay();
}

function disablePlayPause() {

    console.error("disablePlayPause!")
    const playPauseButton = document.getElementById("play-pause-button");
    playPauseButton.disabled = true;

    playPauseButton.removeEventListener('click', playButton)
    playPauseButton.removeEventListener('click', pauseButton);
}

function enablePause() {

    console.error("enablePause!")
    const playPauseButton = document.getElementById("play-pause-button");
    playPauseButton.disabled = false;

    playPauseButton.innerHTML = '<i class="material-icons">pause</i>'
    playPauseButton.removeEventListener('click', pauseButton)
    playPauseButton.removeEventListener('click', playButton)
    playPauseButton.addEventListener('click', pauseButton)

}

function enablePlay() {

    console.error("enablePlay!")
    const playPauseButton = document.getElementById("play-pause-button");
    playPauseButton.disabled = false;

    playPauseButton.innerHTML = '<i class="material-icons">play_arrow</i>'
    playPauseButton.removeEventListener('click', playButton)
    playPauseButton.removeEventListener('click', pauseButton)
    playPauseButton.addEventListener('click', playButton)

}

function readyListener(e) {
    enablePlay();
    updateTrackTimes()
    console.error("Wavesurfer ready")
}

function seekListener(e) {
    console.error("Seeking")
    playButton();
}

function pauseListener(e) {
    console.error("Paused");
    window.clearInterval(trackTimesUpdateInterval);
}

export default class Shader {
    constructor (main) {
        this.main = main;
        this.options = main.options;
        this.frag = '';

        // DOM CONTAINER
        this.el = document.createElement('div');
        this.el.setAttribute('class', 'ge_canvas_container');
        // CREATE AND START GLSLCANVAS
        this.elCanvas = document.createElement('canvas');
        this.elCanvas.setAttribute('class', 'ge_canvas');
        this.elCanvas.setAttribute('data-fragment', this.options.frag_header + this.options.frag + this.options.frag_footer);
        this.el.appendChild(this.elCanvas);
        let glslcanvas = new GlslCanvas(this.elCanvas, { premultipliedAlpha: false, preserveDrawingBuffer: true, backgroundColor: 'rgba(1,1,1,1)' });

        let width = (this.options.canvas_width || this.options.canvas_size || '250');
        let height =  (this.options.canvas_height || this.options.canvas_size || '250');
        glslcanvas.canvas.style.width = width + 'px';
        glslcanvas.canvas.style.height = height + 'px';
        glslcanvas.resize();

        this.canvas = glslcanvas;

        const audioElement = document.getElementById("music");

        let connected = false

        let all_data = null
        let all_keys = null

        let play_listener = () => {

            if (wavesurfer === null) {
                return
            }

//            const AudioContext = window.AudioContext || window.webkitAudioContext;
//            const audioContext = new AudioContext();
//            const track = audioContext.createMediaElementSource(audioElement);
//            let gainNode = audioContext.createGain();
//            track.connect(gainNode);
//            gainNode.connect(audioContext.destination);
//
//            connected = true

            console.log(all_keys)

            this.canvas.on('render', () => {
                if (all_data === null) return;
                let current_time_track_ms = 1000*wavesurfer.getCurrentTime();
                let ix = Math.round(current_time_track_ms / (1000/60))
                console.log(current_time_track_ms - ix * (1000/60));

                all_keys.forEach(key => {
                        glslcanvas.uniform("1f", "float", "u_" + key, all_data[key][ix])
                    }
                )

            });

            trackTimesUpdateInterval = window.setInterval(updateTrackTimes, 100);

        };


        audioElement.addEventListener("change_track", function(event) {

            console.error("change_track");

            all_data = null;

            console.error(event);
            console.error(event.detail.track_data);
            console.error(event.detail.track_audio);
            console.error(event.detail.track_name);

            fetch(event.detail.track_data).then((result)=>{
                result.json().then((data)=>{
                    all_data = data
                    all_keys = Object.keys(data)
                    console.info("JSON data loaded!")
                })
            });

            const audioElement = document.getElementById("music");

            if (wavesurfer != null) {
                wavesurfer.empty();
                wavesurfer.pause()

                wavesurfer.un('play', play_listener);
                wavesurfer.un('seek', seekListener);
                wavesurfer.on('ready')
            }

            var waveSurferElement = document.getElementById("waveform");

//            audioElement.pause();
//            var source = audioElement.getElementsByTagName("source");
//            console.error("source " + source[0].src);
//            source[0].src = event.detail.track_audio;
//            audioElement.load();

            wavesurfer = WaveSurfer.create({
                container: '#waveform',
                waveColor: 'white',
                progressColor: 'gray'
            });

            wavesurfer.on('play', play_listener);

            wavesurfer.on('seek', seekListener);

            wavesurfer.on('ready', readyListener);

            wavesurfer.load(event.detail.track_audio);

            set_current_track_name(event.detail.track_name);


        });

//        audioElement.addEventListener('play', play_listener);

//        wavesurfer.on('play', play_listener);

        audioElement.dispatchEvent(new CustomEvent("change_track", {
            "detail": {
                "track_data": tracks[0]["data"],
                "track_audio": tracks[0]["track"],
                "track_name": tracks[0]["name"]
            }
        }));

        if (this.options.imgs && this.options.imgs.length > 0) {
            for (let i in this.options.imgs) {
                this.canvas.setUniform('u_tex' + i, this.options.imgs[i]);
            }
        }

        // Media Capture
        this.mediaCapture = new MediaCapture();
        this.mediaCapture.setCanvas(this.elCanvas);
        this.canvas.on('render', () => {
            this.mediaCapture.completeScreenshot();
        });

        if (main.options.displayMenu) {
            // CONTROLS
            this.controlsContainer = document.createElement('ul');
            this.controlsContainer.className = CONTROLS_CLASSNAME;
            this.controlPanel = document.createElement('ul');
            this.controlPanel.className = CONTROLS_PANEL_CLASSNAME;
            this.controlsContainer.appendChild(this.controlPanel);
            this.el.appendChild(this.controlsContainer);
            this.controls = {};
            // play/stop
            // this.controls.playPause = new MenuItem(this.controlPanel, 'ge_control_element', '<i class="material-icons">pause</i>', (event) => {
            this.controls.playPause = new MenuItem(this.controlPanel, 'ge_control_element', '<i class="material-icons">pause</i>', (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (glslcanvas.paused) {
                    glslcanvas.play();
                    // this.controls.playPause.name = '<i class="material-icons">pause</i>';//'Pause';
                    this.controls.playPause.name = '<i class="material-icons">pause</i>';//'Pause';
                }
                else {
                    glslcanvas.pause();
                    this.controls.playPause.name = '<i class="material-icons">play_arrow</i>';//'Play';
                }
            });
            // rec
            this.isCapturing = false;
            // let rec = new MenuItem(this.controlPanel, 'ge_control_element', '<i class="material-icons">fiber_manual_record</i>', (event) => {
            let rec = new MenuItem(this.controlPanel, 'ge_control_element', '<i class="material-icons">&#xE061;</i>', (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (this.isCapturing) {
                    this.stopVideoCapture();
                }
                else {
                    this.startVideoCapture();
                }
            });
            this.controls.rec = rec;
            this.controls.rec.button.style.color = 'red';

            // present mode (only if there is a presentation.html file to point to)
            // this.controls.presentationMode = new MenuItem(this.controlPanel, 'ge_control_element', '<i class="material-icons">open_in_new</i>', (event) => {
            this.controls.presentationMode = new MenuItem(this.controlPanel, 'ge_control_element', '<i class="material-icons">open_in_new</i>', (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (main.pWindowOpen) {
                    main.togglePresentationWindow(false);
                }
                else {
                    main.togglePresentationWindow(true);
                }
            });

            this.elControl = this.el.getElementsByClassName(CONTROLS_CLASSNAME)[0];
            this.elControl.addEventListener('mouseenter', (event) => { this.showControls(); });
            this.elControl.addEventListener('mouseleave', (event) => { this.hideControls(); });
            this.elCanvas.addEventListener('mousemove', (event) => {
                if (event.offsetY > this.elCanvas.clientHeight * .66) {
                    this.showControls();
                }
                else {
                    this.hideControls();
                }
            });
            this.hideControls();
        }

        // ========== EVENTS
        // Draggable/resizable/snappable
        if (main.options.canvas_draggable || main.options.canvas_resizable || main.options.canvas_snapable) {
            subscribeInteractiveDom(this.el, {
                move: main.options.canvas_draggable,
                resize: main.options.canvas_resizable,
                snap: main.options.canvas_snapable
            });

            if (main.options.canvas_size === 'halfscreen') {
                this.el.snapRight();
            }

            this.el.on('move', (event) => {
                event.el.style.width = event.el.clientWidth + 'px';
                event.el.style.height = event.el.clientHeight + 'px';
            });
            this.el.on('resize', (event) => {
                glslcanvas.canvas.style.width = event.el.clientWidth + 'px';
                glslcanvas.canvas.style.height = event.el.clientHeight + 'px';
                glslcanvas.resize();
            });
        }

        // If there is a menu offset the editor to come after it
        if (main.menu) {
            this.el.style.top = (main.menu.el.clientHeight || main.menu.el.offsetHeight || main.menu.el.scrollHeight) + 'px';
        }

        // Add all this to the main container
        main.container.appendChild(this.el);
        glslcanvas.resize();
    }

    hideControls () {
        if (this.elControl && this.elControl.className === CONTROLS_CLASSNAME) {
            this.elControl.className = CONTROLS_CLASSNAME + ' ' + CONTROLS_CLASSNAME + '_hidden';
        }
    }

    showControls () {
        if (this.elControl && this.elControl.className === CONTROLS_CLASSNAME + ' ' + CONTROLS_CLASSNAME + '_hidden') {
            this.elControl.className = CONTROLS_CLASSNAME;
        }
    }

    requestRedraw() {
        this.canvas.forceRender = true;
        this.canvas.render();
        console.info("HELLO")
    }

    screenshot () {
        this.requestRedraw();
        return this.mediaCapture.screenshot();
    }

    startVideoCapture () {
        this.requestRedraw();
        if (this.mediaCapture.startVideoCapture()) {
            this.isCapturing = true;
            this.controls.rec.button.style.color = 'white';
            // this.controls.rec.name = '<i class="material-icons">stop</i>';
            this.controls.rec.name = '<i class="material-icons">&#xE061;</i>';
        }
    }

    stopVideoCapture () {
        if (this.isCapturing) {
            this.isCapturing = false;
            this.controls.rec.button.style.color = 'red';
            // this.controls.rec.name = '<i class="material-icons">fiber_manual_record</i>';
            this.controls.rec.name = '<i class="material-icons">stop</i>';
            this.mediaCapture.stopVideoCapture().then((video) => {
                saveAs(video.blob, `${Number(new Date())}.webm`);
            });
        }
    }

    openWindow() {
        this.originalSize = {width: this.canvas.canvas.clientWidth, height: this.canvas.canvas.clientHeight};
        this.presentationWindow = window.open('', '_blank', 'presentationWindow');
        this.setUpPresentationWindow();
    }

    closeWindow() {
        if (this.presentationWindow) {
            this.presentationWindow.close();
        }
    }

    setCanvasSize(w, h) {
        this.canvas.canvas.style.width = w + 'px';
        this.canvas.canvas.style.height = h + 'px';
    }

    setUpPresentationWindow() {
        this.presentationWindow.document.body.appendChild(this.canvas.canvas);
        var d = this.presentationWindow.document;
        var div = d.createElement('div');
        div.appendChild(d.createTextNode('Projector mode'));
        var span = this.presentationWindow.document.createElement('span');
        div.appendChild(span);
        span.appendChild(d.createTextNode(" - If the canvas doesn't update, drag this window and reveal the editor"));
        d.body.appendChild(div);

        d.title = 'GLSL Editor';
        d.body.style.padding = '0';
        d.body.style.margin = '0';
        d.body.style.background = '#171e22';
        d.body.style.overflow = 'hidden';

        div.style.position = 'absolute';
        div.style.width = '100%';
        div.style.background = 'rgba(0, 0, 0, 0.5)';
        div.style.position = 'absolute';
        div.style.top = '0';
        div.style.left = '0';
        div.style.right = '0';
        div.style.padding = '16px';
        div.style.color = '#ffffff';
        div.style.fontSize = '14px';
        div.style.fontFamily = 'Helvetica, Geneva, sans-serif';
        div.style.fontWeight = '400';
        div.style.letterSpacing = '0.1em';
        div.style.textAlign = 'center';
        div.style.opacity = '1';
        div.style.zIndex = '9999';
        div.style.setProperty('-webkit-transition', 'opacity 1.5s');
        div.style.setProperty('-moz-transition', 'opacity 1.5s');
        div.style.setProperty('transition', 'opacity 1.5s');

        span.style.color = 'rgba(255, 255, 255, 0.5)';

        setTimeout(()=>{
            div.style.opacity = 0;
        }, 4000);

        this.setCanvasSize(this.presentationWindow.innerWidth, this.presentationWindow.innerHeight);
        this.presentationWindow.addEventListener('resize', this.onPresentationWindowResize.bind(this));
        this.presentationWindow.addEventListener('unload', this.onPresentationWindowClose.bind(this));
    }

    onPresentationWindowClose() {
        this.el.appendChild(this.canvas.canvas);
        this.setCanvasSize(this.originalSize.width, this.originalSize.height);
        this.canvas.resize();

        this.main.onClosePresentationWindow();
        this.main.menu.onClosePresentationWindow();
        this.presentationWindow = null;
    }

    onPresentationWindowResize() {
        if (this.presentationWindow) {
            this.setCanvasSize(this.presentationWindow.innerWidth, this.presentationWindow.innerHeight);
            this.canvas.resize();
        }
    }
}
