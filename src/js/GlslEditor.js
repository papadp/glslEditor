import 'document-register-element';
import Shader from './core/Shader';
import { initEditor, focusAll } from './core/Editor';

import Menu from './ui/Menu';
import Helpers from './ui/Helpers';
import ErrorsDisplay from './ui/ErrorsDisplay';
import VisualDebugger from './ui/VisualDebugger';
import ExportIcon from './ui/ExportIcon';

import FileDrop from './io/FileDrop';
import HashWatch from './io/HashWatch';
import BufferManager from './io/BufferManager';
import LocalStorage from './io/LocalStorage';
const STORAGE_LAST_EDITOR_CONTENT = 'last-content';

// Import Utils
import xhr from 'xhr';
import { subscribeMixin } from './tools/mixin';

// 3er Parties
import { saveAs } from './vendor/FileSaver.min.js';

// Cross storage for Openframe -- allows restricted access to certain localStorage operations
// on the openframe domain
import { CrossStorageClient } from 'cross-storage';

const EMPTY_FRAG_SHADER = `// Author:
// Title:
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_dror_beat;
uniform float u_dror_beat0;
uniform float u_dror_beat1; 
uniform float u_dror_beat2;
uniform float u_dror_beat3;
uniform float u_dror_stereo_transition;
uniform float u_dror_transition;
uniform float u_dror_dynamic_transition;
uniform float u_dror_transients0;
uniform float u_dror_transients1;
uniform float u_dror_transients10;
uniform float u_dror_transients11;
uniform float u_dror_transients12;
uniform float u_dror_transients13;
uniform float u_dror_transients14;
uniform float u_dror_transients15;
uniform float u_dror_transients16;
uniform float u_dror_transients17;
uniform float u_dror_transients18;
uniform float u_dror_transients19;
uniform float u_dror_transients2;
uniform float u_dror_transients20;
uniform float u_dror_transients21;
uniform float u_dror_transients22;
uniform float u_dror_transients23;
uniform float u_dror_transients24;
uniform float u_dror_transients25;
uniform float u_dror_transients26;
uniform float u_dror_transients27;
uniform float u_dror_transients28;
uniform float u_dror_transients29;
uniform float u_dror_transients3;
uniform float u_dror_transients30;
uniform float u_dror_transients31;
uniform float u_dror_transients32;
uniform float u_dror_transients33;
uniform float u_dror_transients34;
uniform float u_dror_transients35;
uniform float u_dror_transients36;
uniform float u_dror_transients37;
uniform float u_dror_transients38;
uniform float u_dror_transients39;
uniform float u_dror_transients4;
uniform float u_dror_transients5;
uniform float u_dror_transients6;
uniform float u_dror_transients7;
uniform float u_dror_transients8;
uniform float u_dror_transients9;
float transients[40];
void set_transient_array()
{
    transients[0] = u_dror_transients0;
    transients[1] = u_dror_transients1;
    transients[2] = u_dror_transients2;
    transients[3] = u_dror_transients3;
    transients[4] = u_dror_transients4;
    transients[5] = u_dror_transients5;
    transients[6] = u_dror_transients6;
    transients[7] = u_dror_transients7;
    transients[8] = u_dror_transients8;
    transients[9] = u_dror_transients9;
    transients[10] = u_dror_transients10;
    transients[11] = u_dror_transients11;
    transients[12] = u_dror_transients12;
    transients[13] = u_dror_transients13;
    transients[14] = u_dror_transients14;
    transients[15] = u_dror_transients15;
    transients[16] = u_dror_transients16;
    transients[17] = u_dror_transients17;
    transients[18] = u_dror_transients18;
    transients[19] = u_dror_transients19;
    transients[20] = u_dror_transients20;
    transients[21] = u_dror_transients21;
    transients[22] = u_dror_transients22;
    transients[23] = u_dror_transients23;
    transients[24] = u_dror_transients24;
    transients[25] = u_dror_transients25;
    transients[26] = u_dror_transients26;
    transients[27] = u_dror_transients27;
    transients[28] = u_dror_transients28;
    transients[29] = u_dror_transients29;
    transients[30] = u_dror_transients30;
    transients[31] = u_dror_transients31;
    transients[32] = u_dror_transients32;
    transients[33] = u_dror_transients33;
    transients[34] = u_dror_transients34;
    transients[35] = u_dror_transients35;
    transients[36] = u_dror_transients36;
    transients[37] = u_dror_transients37;
    transients[38] = u_dror_transients38;
    transients[39] = u_dror_transients39;
}
vec3 circle(float size, vec2 pos, vec2 st)
{
    float dist = smoothstep(size, size - 0.01, distance(st, pos));
    return vec3(dist, dist, dist);
}
void main() 
{
\tset_transient_array();
    float foo = u_time;
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 total = vec3(0., 0., 0.);
    vec3 dist = circle(0.05 - .025 * u_dror_beat0, vec2(.5, .1), st);
    total = max(dist - vec3(0. + 1. * u_dror_beat0, 0., 0. + 1. * u_dror_beat0), total);
    vec3 dist2 = circle(0.05 - .025 * u_dror_beat1, vec2(.6, .1), st);
    total = max(dist2 - vec3(0. + 1. * u_dror_beat1, 0., 0. + 1. * u_dror_beat1), total);
    vec3 dist3 = circle(0.05 - .025 * u_dror_beat2 , vec2(.7, .1), st);
\ttotal = max(dist3 - vec3(0. + 1. * u_dror_beat2, 0., 0. + 1. * u_dror_beat2), total);
    vec3 dist4 = circle(0.05 - .025 * u_dror_beat3, vec2(.8, .1), st);
    total = max(dist4 - vec3(0. + 1. * u_dror_beat3, 0., 0. + 1. * u_dror_beat3), total);
    vec3 dist5 = circle(0.1 - .05 * u_dror_stereo_transition, vec2(.4, .3), st);
    total = max(dist5 - vec3(0. + 1. * u_dror_stereo_transition, 0., 0. + 1. * u_dror_stereo_transition), total);
    vec3 dist6 = circle(0.15 - .075 * u_dror_transition, vec2(.65, .3), st);
    total = max(dist6 - vec3(0. + 1. * u_dror_transition, 0., 0. + 1. * u_dror_transition), total);
    vec3 dist7 = circle(0.1 - .05 * u_dror_dynamic_transition , vec2(.9, .3), st);
    total = max(dist7 - vec3(0. + 1. * u_dror_dynamic_transition, 0., 0. + 1. * u_dror_dynamic_transition), total);
    for(int i=0; i<40; ++i)
    {
      float i_float = float(i);
      float y = mod(i_float, 5.);
      float x = i_float - y;
      vec3 transient_dist = circle(0.05 - .025 * transients[i] , vec2(.1 + x * .025, .9 - (y) * .1), st);
      total = max(transient_dist - vec3(0. + 1. * transients[i], 0., 0. + 1. * transients[i]), total);
    }
    vec3 color = total;
    gl_FragColor = vec4(color,1.0);
}`;

export default class GlslEditor {
    constructor (selector, options) {
        this.createFontLink();
        subscribeMixin(this);

        if (typeof selector === 'object' && selector.nodeType && selector.nodeType === 1) {
            this.container = selector;
        }
        else if (typeof selector === 'string') {
            this.container = document.querySelector(selector);
            if (!this.container) {
                throw new Error(`element ${selector} not present`);
            }
        }
        else {
            console.log('Error, type ' + typeof selector + ' of ' + selector + ' is unknown');
            return;
        }

        this.options = {};
        this.change = false;
        this.autoupdate = true;

        if (options) {
            this.options = options;
        }

        if (this.options.imgs === undefined) {
            this.options.imgs = [];
        }

        if (this.options.display_menu === undefined) {
            this.options.display_menu = true;
        }

        if (this.container.hasAttribute('data-textures')) {
            let imgList = this.container.getAttribute('data-textures').split(',');
            for (let i in imgList) {
                this.options.imgs.push(imgList[i]);
            }
        }

        // Default Theme
        if (!this.options.theme) {
            this.options.theme = 'default';
        }

        // Default Context
        if (!this.options.frag) {
            var innerHTML = this.container.innerHTML.replace(/&lt;br&gt;/g,'');
            innerHTML = innerHTML.replace(/<br>/g,'');
            innerHTML = innerHTML.replace(/&nbsp;/g,'');
            innerHTML = innerHTML.replace(/&lt;/g,'<');
            innerHTML = innerHTML.replace(/&gt;/g,'>');
            innerHTML = innerHTML.replace(/&amp;/g,'&');
            this.options.frag = innerHTML || EMPTY_FRAG_SHADER;

            if (innerHTML) {
                this.container.innerHTML = '';
            }
        }

        // Default invisible Fragment header
        if (!this.options.frag_header) {
            this.options.frag_header = '';
        }

        // Default invisible Fragment footer
        if (!this.options.frag_footer) {
            this.options.frag_footer = '';
        }

        // Listen to hash changes
        if (this.options.watchHash) {
            new HashWatch(this);
        }

        // Load UI
        if (this.options.menu) {
            this.menu = new Menu(this);
        }

        // Support for multiple buffers
        if (this.options.multipleBuffers) {
            this.bufferManager = new BufferManager(this);
        }

        // Listen to file drops
        if (this.options.fileDrops) {
            new FileDrop(this);
        }

        if (this.options.indentUnit === undefined) {
            this.options.indentUnit = 4;
        }

        if (this.options.tabSize === undefined) {
            this.options.tabSize = 4;
        }

        if (this.options.indentWithTabs === undefined) {
            this.options.indentWithTabs = false;
        }

        if (this.options.lineWrapping === undefined) {
            this.options.lineWrapping = true;
        }

        if (this.options.autofocus === undefined) {
            this.options.autofocus = true;
        }

        // CORE elements
        this.shader = new Shader(this);
        this.editor = initEditor(this);

        this.helpers = new Helpers(this);
        this.errorsDisplay = new ErrorsDisplay(this);
        this.visualDebugger = new VisualDebugger(this);

        if (this.options.exportIcon) {
            this.export = new ExportIcon(this);
        }

        // EVENTS
        this.editor.on('change', () => {
            if (this.autoupdate) {
                this.update();
            }
        });

        if (this.options.canvas_follow) {
            this.shader.el.style.position = 'relative';
            if (this.options.canvas_float) {
                this.shader.el.style.float = this.options.canvas_float;
            }
            this.editor.on('cursorActivity', (cm) => {
                let height = cm.heightAtLine(cm.getCursor().line + 1, 'local') - this.shader.el.clientHeight;
                if (height < 0) {
                    height = 0.0;
                }
                this.shader.el.style.top = height.toString() + 'px';

            });
        }

        // If the user bails for whatever reason, hastily shove the contents of
        // the editor into some kind of storage. This overwrites whatever was
        // there before. Note that there is not really a way of handling unload
        // with our own UI and logic, since this allows for widespread abuse
        // of normal browser functionality.
        window.addEventListener('beforeunload', (event) => {
            let content = {};
            if (this.bufferManager && Object.keys(this.bufferManager.buffers).length !== 0) {
                for (var key in this.bufferManager.buffers) {
                    content[key] = this.bufferManager.buffers[key].getValue();
                }
            }
            else {
                content[(new Date().getTime()).toString()] = this.editor.getValue();
            }

            if (this.options.menu) {
                LocalStorage.setItem(STORAGE_LAST_EDITOR_CONTENT, JSON.stringify(content));
            }
        });

        if (this.options.menu) {
            // If there is previus content load it.
            let oldContent = JSON.parse(LocalStorage.getItem(STORAGE_LAST_EDITOR_CONTENT));
            if (oldContent) {
                for (var key in oldContent) {
                    this.open(oldContent[key], key);
                }
            }
            else {
                this.new();
            }
        }
        else {
            this.new();
        }

        if (this.options.menu || this.options.exportIcon) {
            // setup CrossStorage client
            this.storage = new CrossStorageClient('https://openframe.io/hub.html');
            this.storage.onConnect().then(() => {
                console.log('Connected to OpenFrame [o]');
            });
            // }).bind(this);
        }

        return this;
    }

    new () {
        this.setContent(this.options.frag || EMPTY_FRAG_SHADER, (new Date().getTime()).toString());
        this.trigger('new_content', {});
        this.options.frag = null;
    }

    setContent(shader, tabName) {
        // If the string is CODE
        if (this.shader && this.shader.canvas) {
            if (this.debugging) {
                this.debugging = false;
                focusAll(this.editor);
            }
            this.shader.canvas.load(this.options.frag_header + shader + this.options.frag_footer);
        }

        if (this.editor) {
            if (tabName !== undefined && this.bufferManager !== undefined) {
                this.bufferManager.open(tabName, shader);
                this.bufferManager.select(tabName);
            }
            else {
                this.editor.setValue(shader);
                this.editor.setSize(null, this.editor.getDoc().height + 'px');
                this.editor.setSize(null, 'auto');
                this.filename = tabName;
            }
        }
        this.change = true;
    }

    open (shader, tabName) {
        if (typeof shader === 'object') {
            const reader = new FileReader();
            let ge = this;
            reader.onload = (e) => {
                ge.setContent(e.target.result, shader.name);
            };
            reader.readAsText(shader);
        }
        else if (typeof shader === 'string') {
            if (/\.frag$/.test(shader) || /\.fs$/.test(shader)) {
                // If the string is an URL
                xhr.get(shader, (error, response, body) => {
                    if (error) {
                        console.log('Error downloading ', shader, error);
                        return;
                    }
                    this.setContent(body, tabName);
                });
            }
            else {
                this.setContent(shader, tabName);
            }
        }
    }

    getContent() {
        return this.editor.getValue();
    }

    getAuthor() {
        let content = this.getContent();
        let result = content.match(/\/\/\s*[A|a]uthor\s*[\:]?\s*([\w|\s|\@|\(|\)|\-|\_]*)/i);
        if (result && !(result[1] === ' ' || result[1] === '')) {
            let author = result[1].replace(/(\r\n|\n|\r)/gm, '');
            return author;
        }
        else {
            return 'unknown';
        }
    }

    getTitle() {
        let content = this.getContent();
        let result = content.match(/\/\/\s*[T|t]itle\s*:\s*([\w|\s|\@|\(|\)|\-|\_]*)/i);
        if (result && !(result[1] === ' ' || result[1] === '')) {
            let title = result[1].replace(/(\r\n|\n|\r)/gm, '');
            return title;
        }
        else if (this.bufferManager !== undefined) {
            return this.bufferManager.current;
        }
        else {
            return 'unknown';
        }
    }

    // Returns Promise
    getOfToken() {
        return this.storage.get('accessToken');
    }

    download () {
        let content = this.getContent();
        let name = this.getTitle();
        if (name !== '') {
            name += '-';
        }
        name += new Date().getTime();

        // Download code
        const blob = new Blob([content], { type: 'text/plain' });
        saveAs(blob, name + '.frag');
        this.editor.doc.markClean();
        this.change = false;
    }

    update () {
        if (this.debugging) {
            this.debugging = false;
            focusAll(this.editor);
        }

        if (this.visualDebugger.testingResults.length) {
            this.visualDebugger.clean();
        }
        this.shader.canvas.load(this.options.frag_header + this.editor.getValue() + this.options.frag_footer);
    }

    createFontLink() {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.media = 'screen,print';
        head.appendChild(link);
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    togglePresentationWindow(flag) {
        this.pWindowOpen = flag;
        if (flag) {
            this.shader.openWindow();
        }
        else {
            this.shader.closeWindow();
        }
    }

    onClosePresentationWindow() {
        this.pWindowOpen = false;
    }
}

window.GlslEditor = GlslEditor;

var GlslWebComponent = function() {};
GlslWebComponent.prototype = Object.create(HTMLElement.prototype);
GlslWebComponent.prototype.createdCallback = function createdCallback() {
    var options = {
        canvas_size: 150,
        canvas_follow: true,
        tooltips: true
    };

    for (var i = 0; i < this.attributes.length; i++) {
        var attribute = this.attributes[i];
        if (attribute.specified) {
            var value = attribute.value;

            if (value === 'true') {
                value = true;
            }
            else if (value === 'false') {
                value = false;
            }
            else if (parseInt(value)) {
                value = parseInt(value);
            }

            options[attribute.name] = value;
        }
    }

    this.glslEditor = new GlslEditor(this, options);
};

document.registerElement('glsl-editor', GlslWebComponent);
