import {Geometry} from '../geometry';
import { extend } from '@julien.cousineau/util';
import {Selafin} from 'slf-js';
import Layer from './layer.js';
import Primitive from './primitive';

export default class LayerSLF extends Layer {
  constructor(options) {
    super(options);
  }
  async getGeometry(){
    if(!this.geometry){
      const slf = this.slf = await this.getSLF(this.source);
      const position = slf.XY;
      const indices = slf.IKLE3F;
      const windices = slf.IKLEW;
      this.geometry = new Geometry(extend({gl:this.gl},{position:position,indices:indices,windices:windices}));
      slf.varnames.forEach((id)=>this.addAttribute(id,'slf'));
      if(this.source.binaries){
        for(let id in this.source.binaries)this.addAttribute(id,'slf');
      }
    }
  }
  async getSLF(source){
    const {type,data}=source;
    if(type=='grid')return this.testSLF(data);
    throw new Error("TODO");
  }
  testSLF(options){
    const slf = new Selafin(null,{keepframes:true,debug:0});
    
    const obj=Primitive['grid'](options);
    slf.addTITLE("Grid - Test2");
    slf.addVAR({'name':'BOTTOM','unit':'m'});
    slf.addPOINTS(obj.x,obj.y);
    slf.addIKLE(obj.indices);
    const frame1=new Float32Array(slf.NVAR * slf.NPOIN3);
    for(let i=0;i<frame1.length;i++)frame1[i]= parseFloat(i) / frame1.length;
    slf.addFrame(frame1);
    return slf;
  }
}
