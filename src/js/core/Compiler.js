import Color from '../ui/pickers/types/Color';
import Vector from '../ui/pickers/types/Vector';

export default class Compiler {

    constructor (main) {
        this.LIVE_VARIABLE = 'u_ge_live_variable';
        this.header = '';
        this.main = main;
        this.main.editor.on('change', this.onChange.bind(this));
    }

    liveVariable (value, replacement, start, end) {
        this.liveVariablePosition = {
            start: start,
            end: {
                line: end.line,
                ch: start.ch + replacement.length
            }
        };
        var type = value.uniformType();
        var uniformValue = value.uniformValue();
        var method = value.uniformMethod();
        this.setUniform = function() {
            this.main.shader.canvas.uniform.apply(
                this.main.shader.canvas,
                [
                    method,
                    type,
                    this.LIVE_VARIABLE
                ].concat(uniformValue)
            );
        }
        this.setUniform();
        this.header = `#ifdef GL_ES
precision mediump float;
#endif
uniform` + type + ' ' + this.LIVE_VARIABLE + ';';
        this.main.editor.replaceRange(replacement, start, end);
    }

    updateTextures() {
        for (let i = 0; i < this.main.editor.getDoc().size; i++) {
            let match = this.main.editor.getDoc().getLine(i).match(/uniform\s*sampler2D\s*([\w]*);\s*\/\/\s*([\w|\:\/\/|.]*)/i);
            if (match) {
                let texture_name = match[1];
                let texture_url = match[2];
                let texture_ext = texture_url.split('.').pop();
                if (texture_name && 
                    texture_url && 
                    (texture_ext === 'jpg' || texture_ext === 'JPG' ||
                     texture_ext === 'jpeg' || texture_ext === 'JPEG' ||
                     texture_ext === 'png' || texture_ext === 'PNG')) {

                    if (this.main.shader.canvas.textures[texture_name]) {
                        if (this.main.shader.canvas.textures[texture_name].url &&
                            this.main.shader.canvas.textures[texture_name].url !== texture_url) {
                            this.main.shader.canvas.textures[texture_name].load({url:texture_url});
                        }
                    }
                    else {
                        this.main.shader.canvas.setUniform(texture_name, texture_url);
                    }
                }
            }
        }

        
    }

    onChange () {
        this.updateTextures();
        this.updateShader([
            this.main.options.frag_header,
            this.header,
            this.getValue(),
            this.main.options.frag_footer
        ].join(''));
    }

    updateShader (glsl) {
        if (this.glsl !== glsl) {
            this.main.shader.canvas.load(glsl);
            this.setUniform && this.setUniform();
            this.glsl = glsl;
        }
    }

    getValue () {
        let value = this.main.editor.getValue();
        if ( ! this.liveVariablePosition) {
            return value;
        }
        let doc = this.main.editor.getDoc();
        let start = doc.indexFromPos(this.liveVariablePosition.start);
        let end = doc.indexFromPos(this.liveVariablePosition.end);
        let len = end - start;
        delete this.liveVariablePosition;
        return value.substr(0, start) + this.LIVE_VARIABLE + value.substr(end);
    }
}