#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision mediump float;
uniform sampler2D t_color;
uniform vec2 minmax;
varying float fvalue;

float divider = 1.0 / abs(minmax[1]-minmax[0]);

void main()
{
    
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    float delta = fwidth(r);
    float alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);

    
    float norm = (fvalue-minmax[0]) * divider;
    vec2 ramp_pos = vec2(
    fract(32.0 * norm),
    floor(32.0 * norm) / 32.0);
    vec4 color = texture2D(t_color, ramp_pos);
    float edge = 1.0 - 1.0 / 10.0;
    float stroke = 1.0 - smoothstep(edge - delta, edge + delta, r);
    gl_FragColor = mix(vec4(0.0,0.0,0.0,1.0), color, stroke) * alpha;
  

}