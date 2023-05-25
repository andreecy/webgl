import { mat4 } from "gl-matrix";
import { Shader } from "./renderer/shader";
import { IndexBuffer, VertexBuffer } from "./renderer/buffer";
import { VertexArray } from "./renderer/vertexarray";

// Vertex shader program
const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

const vertices = [
  // positions        // texture coords
  1.0, 1.0, 0.0,

  1.0, -1.0, 0.0,

  -1.0, -1.0, 0.0,

  -1.0, 1.0, 0.0,
];

const indices = [
  0,
  1,
  3, // first triangle
  1,
  2,
  3, // second triangle
];

const main = () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#glcanvas");
  // Initialize the GL context
  const gl = canvas?.getContext("webgl2");

  // Only continue if WebGL is available and working
  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  const shader = new Shader(gl, vsSource, fsSource);
  const vao = new VertexArray(gl);
  const vbo = new VertexBuffer(gl, vertices);
  const ibo = new IndexBuffer(gl, indices);
  // position
  vao.linkAttrib(
    vbo,
    shader.getAttribLocation("aVertexPosition"),
    3,
    gl.FLOAT,
    false,
    0,
    0
  );
  vao.unbind();
  vbo.unbind();
  ibo.unbind();

  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // camera
  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create()
  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();
  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0]
  ); // amount to translate

  shader.bind();
  shader.setUniformMatrix4fv("uProjectionMatrix", projectionMatrix);
  shader.setUniformMatrix4fv("uModelViewMatrix", modelViewMatrix);

  vao.bind();
  ibo.bind();

  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};

main();
