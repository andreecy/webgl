// creates a shader of the given type, uploads the source and
// compiles it.
function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    console.log("Error loading shader");
    return null;
  }

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export class Shader {
  gl: WebGLRenderingContext;
  shaderProgram: WebGLProgram | null = null;

  constructor(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
    this.gl = gl;
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    if (vertexShader && fragmentShader && shaderProgram) {
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      // If creating the shader program failed, alert

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log(
          `Unable to initialize the shader program: ${gl.getProgramInfoLog(
            shaderProgram
          )}`
        );
      }
      this.shaderProgram = shaderProgram;
    }
  }

  bind() {
    this.gl.useProgram(this.shaderProgram);
  }

  unbind() {
    this.gl.useProgram(null);
  }

  getAttribLocation(name: string) {
    if (this.shaderProgram) {
      return this.gl.getAttribLocation(this.shaderProgram, name);
    }
    return 0;
  }

  getUniformLocation(name: string) {
    if (this.shaderProgram) {
      return this.gl.getUniformLocation(this.shaderProgram, name);
    }
    return null;
  }

  setUniformMatrix4fv(name: string, value: Iterable<number>) {
    this.gl.uniformMatrix4fv(this.getUniformLocation(name), false, value);
  }
}
