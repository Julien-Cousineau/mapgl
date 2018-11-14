precision mediump float;

//VARIABLESVAR
//VARIABLESMINMAX
//VARIABLESATT


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
  // float _data = clamp(data,_min,_max);
  
  float divider = max(_max - _min, 0.001);
  float _norm = (data - _min)/divider;
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
float compute(sampler2D _texture,vec2 minmax,vec4 att){
  vec4 color = texture2D(_texture, (gl_FragCoord.xy) / (u_res));
  float value = decode(color.rg,minmax);
  return normalize(value,att);
}

void main() {
  fValue = 0.0;
  fConstrain = 1.0;
  //VARIABLESCOMPUTE
  //VARIABLESCONSTRAIN

  fValue *= fConstrain;  
  gl_FragColor = encode(fValue,vec2(0.0,1.0));
  // gl_FragColor = vec4(1,1,1,1);
  // gl_FragColor = encode(compute(values,valuesminmax),vec2(0.0,1.0));
  
}