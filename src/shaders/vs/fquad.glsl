precision mediump float;

attribute vec3 position;
attribute float vindices;

uniform mat4 u_matrix;
uniform mat4 v_matrix;
uniform float u_res;


// varying float fvindices;
uniform sampler2D fbtexture;
varying float fvalue;

uniform vec2 minmax;
// float divider = 1.0 / abs(minmax[1]-minmax[0]);
float decode(vec2 pair){
    float y = pair[0] * 255.0; //0-1 x 255
    float x = pair[1] * 255.0 * 255.0;
    return ((y+x) / 255.0 / 255.0 * (minmax[1]-minmax[0])) + minmax[0];
}



void main() {
  gl_Position = u_matrix * v_matrix *vec4(position, 1);
  gl_PointSize = 10.0;
  float x = (fract(vindices / u_res) * u_res) + 0.5; // We want the middle of pixel
  float y = floor(vindices / u_res) + 0.5; // We want the middle of pixel
  vec2 pos    = vec2(x,y);
  vec4 color = texture2D(fbtexture, pos / u_res);
  fvalue = decode(color.rg);

  
}