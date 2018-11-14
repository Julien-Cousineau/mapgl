precision mediump float;
uniform sampler2D t_color;
uniform vec2 minmax;
uniform float base;
varying float fvalue;

float c_min  = minmax[0];
float c_max  = minmax[1];
float c_dif = max(0.000001,abs(c_max-c_min)); 
float c_div  = 1.0 / c_dif;

  
void main() {
  
  float value   = clamp(pow((fvalue-c_min) * c_div,base),0.0,1.0);
  vec2 ramp_pos = vec2(1.0,value);
  vec4 color    =  texture2D(t_color, ramp_pos);
  gl_FragColor  = color;
}