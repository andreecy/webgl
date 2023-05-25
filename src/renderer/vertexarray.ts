import { VertexBuffer } from "./buffer";

export class VertexArray {
  gl: WebGL2RenderingContext;
  vao: WebGLVertexArrayObject | null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
  }

  bind() {
    this.gl.bindVertexArray(this.vao);
  }

  unbind() {
    this.gl.bindVertexArray(null);
  }

  linkAttrib(
    vbo: VertexBuffer,
    index: number,
    size: number,
    type: number,
    normalized: boolean,
    stride: number,
    offset: number
  ) {
    vbo.bind();
    this.gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    this.gl.enableVertexAttribArray(index);
  }
}
