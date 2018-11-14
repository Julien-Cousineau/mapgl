precision mediump float;

uniform sampler2D value;
uniform vec2 valueminmax;
// uniform vec4 valuesatt; 


// uniform sampler2D dtexture;
uniform float u_res;


float fValue;
float fConstrain;
  
float normalize(float data,vec4 att){
  float _bottom = att[0];
  float _top = att[1];
  float _p = att[2];
  
  float _dir = sign(_top - _bottom);
  
  float _min = min(_bottom,_top);
  float _max = max(_bottom,_top);
  float _data = clamp(data,_min,_max);
  float _norm = (_data - _min)/(_max - _min);
  float _norm2 = clamp(_norm,0.0,1.0);
  float _value = max(_norm2*_dir,(_dir*-1.0) - _norm2);
  return pow(_value, _p);
  // return att[1];
  // return data;
}
vec4 encode(float _value,vec2 minmax) {   
    float value = (_value - minmax[0])/max(abs(minmax[1] - minmax[0]),0.0001) * 255.0 * 255.0;
    vec4 color = vec4(fract(value / 255.0),floor(value / 255.0),0.0,255.0) / 255.0 ;
    return color;
}  
float decode(vec2 pair,vec2 minmax){
    float y = pair[0];
    float x = pair[1] * 255.0;
    return ((y+x) / 255.0 * (minmax[1]-minmax[0])) + minmax[0];
}
float compute(sampler2D _texture,vec2 minmax){
  vec4 color = texture2D(_texture, (gl_FragCoord.xy) / (u_res));
  float value = decode(color.rg,minmax);
  return value;
}

void main() {
  gl_FragColor = encode(compute(value,valueminmax),vec2(0.0,1.0));
  
}