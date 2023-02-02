'use strict'

/**
 * The Texture class is used to store texture information and load image data
 * 
 */
class Texture {

    /**
     * Create a new texture instance
     * 
     * @param {String} filename Path to the image texture to load
     * @param {WebGL2RenderingContext} gl The webgl2 rendering context
     * @param {Boolean} flip_y Determines if the texture should be flipped by WebGL (see Ch 7)
     */
    constructor(filename, gl, flip_y = true) {
        this.filename = filename 
        this.texture = null
        this.texture = this.createTexture( gl, flip_y )
    }

    /**
     * Get the GL handle to the texture
     * 
     * @returns {WebGLTexture} WebGL texture instance
     */
    getGlTexture() {
        return this.texture
    }

    /**
     * Loads image data from disk and creates a WebGL texture instance
     * 
     * @param {WebGL2RenderingContext} gl The webgl2 rendering context
     * @param {Boolean} flip_y Determines if the texture should be flipped by WebGL (see Ch 7)
     * @returns {WebGLTexture} WebGL texture instance
     */
    createTexture( gl, flip_y ) {


        // set up texture flipping
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flip_y);

        // create a new texture
        let texture = gl.createTexture();

        // the constants we need for gl.texImage2D
        const level = 0
        const internal_format = gl.RGBA
        const src_format = gl.RGBA
        const src_type = gl.UNSIGNED_BYTE
    
        // Create a new image to load image data from disk
        const image = new Image();
        image.onload = () => {
            // bind the texture
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // arg1 = target, aka the texture
            // arg2 = level of detail, with 0 being the base and higher values being reduced
            // arg3 = internal format (eg RGB, RGBA, ALPHA)
            // arg4 = width of texture
            // arg5 = height of texture
            // arg6 = width of border (can only be 0 or 1, so is essentially whether the texture has a border)
            // arg7 = format of texel data. usually the same as the internal format
            // arg8 = type of texel data (eg unsigned byte)
            gl.texImage2D(gl.TEXTURE_2D, level, internal_format, src_format, src_type, image)
    
            // generate mipmap from the full-size texture
            gl.generateMipmap(gl.TEXTURE_2D)
     
            // set up texture wrapping mode to repeat the texture
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    
            // set up texture MIN/MAG filtering
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
        }
        
        // By setting the image's src parameter the image will start loading data from disk
        // When the data is available, image.onload will be called
        image.src = this.filename

        return texture
    }
}

export default Texture