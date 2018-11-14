import mca from './mca.glsl';
export default function(array){
  return mca.replaceAll("//VARIABLESVAR",array.map(layer=>'uniform sampler2D {0};'.format(layer)).join("\n"))
    .replaceAll("//VARIABLESMINMAX",array.map(layer=>'uniform vec2 {0}minmax;'.format(layer)).join("\n"))
    .replaceAll("//VARIABLESATT",array.map(layer=>'uniform vec4 {0}att;'.format(layer)).join("\n"))
    .replaceAll("//VARIABLESCOMPUTE",array.map(layer=>'float _{0} = compute({0},{0}minmax,{0}att);\n  fValue += _{0} * {0}att[3];'.format(layer)).join("\n"))
    .replaceAll("//VARIABLESCONSTRAIN",array.map(layer=>'fConstrain *= sign(_{0});'.format(layer)).join("\n"));      
}