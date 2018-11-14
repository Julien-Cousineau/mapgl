precision mediump float;

#define PI 3.1415926535897932384626433832795

attribute vec3 position;
attribute float value;
attribute float triarea;

uniform mat4 u_matrix;
uniform float worldSize;
uniform float zoom;
uniform float u_pointsize;


varying float fvalue;

float lngX(float lng) {
  return  (180.0 + lng) * worldSize / 360.0;
}
float latY(float lat) {
  float y = 180.0 / PI * log(tan(PI / 4.0 + lat * PI / 360.0));
  return (180.0 -y) * worldSize / 360.0;
}
// float scale = pow(2.0,22.0-zoom) * 0.000000001;


void main() {
  // if(triarea > scale) {
  gl_Position = u_matrix * vec4(lngX(position[0]),latY(position[1]),position[2], 1.0);  
  // } else {
  // gl_Position = vec4(2,2,2,1.0);
  // }
  
  gl_PointSize = u_pointsize;
  fvalue = value;
}