import {select} from "d3-selection";
import MapGL from '../src';
import layers from './layers.json';


const element = select(document.getElementsByTagName("body")[0]).append("div")
  .style('position','absolute')
  .style('top',0)
  .style('bottom',0)
  .style('left',0)
  .style('right',0)
  .style('background','white');
const canvas = select(document.getElementsByTagName("body")[0]).append("div")
  .style('position','absolute')
  .style('top',0)
  .style('left',0)
  .style('width','200px')
  .style('height','200px')
  .style('background','white');
const mapgl=new MapGL().render(element).render2d(canvas).addLayers(layers);
mapgl.drawSceneAsync();
let cut=0;
setInterval(()=>{
  const geometry = mapgl.getLayer("test-grid").geometry;
  const n = geometry.indices['indices'].indices.length;
  if(cut>=n)cut=0;
  cut += 3;
  const newindices = geometry.indices['indices'].indices.slice(0,cut);
  geometry.updateIndices('indices',newindices);
  mapgl.drawSceneAsync();
},50);


if (module.hot) {
  module.hot.dispose(function() {
    mapgl.remove();
    element.remove();
    canvas.remove();
    
  });
  module.hot.accept();
}
