
import {drawQuad,createFrameBuffer} from '../helper';
const {extend} = require('@julien.cousineau/util');
import Texture from '../texture';
import {Geometry} from '../geometry';
import Program from './program.js';
export default class ProgramQuad extends Program{
  constructor(options){
    super(options);
    this.fb        =  createFrameBuffer(this.gl);
    this.fbtexture = new Texture({gl:this.gl,width: this.layer.geometry.res,height:this.layer.geometry.res});
    this.quad      = new Geometry({gl:this.gl,position:new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),positionNumComponents:2}); 
  }
  get attributes(){return this.layer.attributes;}
  get geometry(){return this.quad;}
  get ctx(){return this.app.ctx;}
  get uniforms(){
    let uniforms=this.attribute.uniforms;
    for(let id in this.attributes){
      if(this.attributes[id].type!='quad')uniforms=extend(uniforms,this.attributes[id].quaduniforms);
    }
    return uniforms;
  }
  get textures(){
    const textures = {};
    for(let id in this.attributes){
      if(this.attributes[id].type!='quad')textures[id]=this.attributes[id].texture;
    }
    return textures;
  }
  drawScene(){
    if(!this.active)return;
    console.log("drawQuad");
    drawQuad(this);
    if(this.ctx)this.fbtexture.putImageData(this.ctx);
    this.hide();
  }
}

