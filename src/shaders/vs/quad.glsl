precision mediump float;
attribute vec2 position;
varying vec2 tex_pos;
  
void main() {
  tex_pos = position;
  gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
  gl_PointSize = 10.0;
}