import ignore from './style.scss';
import Layer from './layer';
import Camera from './camera';
import { clearScene } from './helper';
import { extend } from '@julien.cousineau/util';

export default class MapGL {
  constructor(options) {
    options     = options||{};
    this.framework = options.framework || 'canvas';
    this.layers={};
  }
  addLayers(layers){
    for(let id in layers)this.addLayer(id,layers[id]);
    return this;
  }
  addLayer(id,options){
    if(this.layers[id])throw new Error("id already exist");
    const _layer  = Layer[options.type] || Layer['primitive'];
    const layer = this.layers[id] = new _layer(extend({id:id,app:this},options || {}));
    return layer;
  }
  getLayer(id){
    if(!this.layers[id])throw new Error("id does not exist");
    return this.layers[id];
  }

  get u_matrix(){return this.camera.u_matrix;}
  get v_matrix(){return this.camera.v_matrix;}
  get uniforms(){return {u_matrix:{ data: this.u_matrix, type: 'matrix' },v_matrix:{ data: this.v_matrix, type: 'matrix' }};}
  setGL(gl){this.gl=gl;}
  
  render(element){return this.rendergl(element);}
  rendergl(element) {
    const canvasglparent = this.canvasglparent = element.append('div').attr('class','mapgl');
      
    const width = canvasglparent.node().getBoundingClientRect().width;
    const height = canvasglparent.node().getBoundingClientRect().height;
    const canvasgl = this.canvasgl =canvasglparent.append('canvas').attr('width', width).attr('height', height);
    this.gl = canvasgl.node().getContext('webgl');
    this.setExtension();
    this.setCamera();
    return this;
  }
  setCamera(){this.camera = new Camera({app:this});}
  render2d(element) {
    const canvas2dp = this.canvas2dp = element.append('div').attr('class','canvas2d');
    const width = canvas2dp.node().getBoundingClientRect().width;
    const height = canvas2dp.node().getBoundingClientRect().height;
    const canvas2d = this.canvas2d =canvas2dp.append('canvas').attr('width', width).attr('height', height);
    this.ctx = canvas2d.node().getContext("2d");
    return this;
  }
  remove(){
    if(this.canvasglparent)this.canvasglparent.remove();
    if(this.canvas2dp)this.canvas2dp.remove();
  }
  setExtension(){
    this.gl.getExtension('OES_element_index_uint');
    this.gl.getExtension('OES_standard_derivatives');
    this.gl.getExtension('EXT_shader_texture_lod');
    if (!this.gl) alert("Unable to initialize WebGL. Your browser or machine may not support it.");
  }
  clear(){
    if(this.gl)clearScene(this.gl);    
  }
  async getData(){
    for (const id in this.layers){
      await this.layers[id].getData();
    }
    return this;
  }
  drawScene() {for (const id in this.layers)this.layers[id].drawScene();}
  async drawSceneAsync(){
    await this.getData();
    this.clear();
    this.drawScene();  
    return this;
  }
}
