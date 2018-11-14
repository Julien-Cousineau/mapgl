import {createArrayBuffer,createElementBuffer,updateElementBuffer} from '../helper';
const {extend} = require('@julien.cousineau/util');
export default class Geometry {
  constructor(options){
    options = options|| {};
    if(!options.gl)throw new Error("Geometry must contain gl");
    this.gl = options.gl;
    this.positionNumComponents = options.positionNumComponents || 3;
    this.buffers = {};
    this.dynamicIndices = true ; //TODO
    this.indices={};
    
    if(options.position)this.setPosition(options.position);
    if(options.indices)this.setIndices('indices',options.indices);
    if(options.windices)this.setIndices('windices',options.windices);
    
  }
  setPosition(position){
    const {gl,positionNumComponents}=this;
    this.position  = position;
    const npoints  = this.npoints  = this.position.length / positionNumComponents;
    const vindices = this.vindices = new Float32Array(npoints).range();
    
    this.res              = Math.ceil(Math.sqrt(npoints));
    this.buffers.position = {data:createArrayBuffer(gl, position),numComponents:positionNumComponents};
    this.buffers.vindices = {data:createArrayBuffer(gl, vindices),numComponents:1};
    return this;
  }
  setIndices(id,indices){
    const {gl}=this;
    this.indices[id]={
      indices    : indices,
      nindices   : indices.length,
      nelem      : indices.length / 3.0,
      buffer     : {data:createElementBuffer(gl, indices),numComponents:1},
      indiceType : (indices instanceof Uint16Array) ? gl.UNSIGNED_SHORT:gl.UNSIGNED_INT
    };
    return this;
  }
  updateIndices(id,indices){
    const {gl}=this;
    this.indices[id].nindices    = indices.length;
    this.indices[id].nelem       = indices.length / 3.0;
    updateElementBuffer(gl,this.indices[id].buffer.data,indices);

    return this;
  }
  getIndices(type){
    return (type=='line')?this.indices['windices']:this.indices['indices'];
  }
  getBuffers(type){
    const indices = this.getIndices(type);
    return (indices)? extend(this.buffers,{indices:this.getIndices(type).buffer}):this.buffers;
  }
}
