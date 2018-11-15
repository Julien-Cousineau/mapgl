
import Texture from '../texture';
import {Program,ProgramQuad} from '../program';
import { extend } from '@julien.cousineau/util';
import {AStyle} from '@julien.cousineau/layerstyle';
import {createArrayBuffer} from '../helper';
import Shaders from '../shaders';
export default class Attribute extends AStyle {
  constructor(options) {
    super(options);
    options = options || {};
    if(!options.layer)throw new Error("Attribute must contain layer"); 
    this.id       = options.id;
    this.layer    = options.layer;
    this.type     = 'attribute';
    this.programs = {};
    this.minmax   = [0,1]; //TODO this is hack for drawing fquad
  }
  get gl(){return this.layer.gl;}
  get app(){return this.layer.app;}
  get geometry(){return this.layer.geometry;}
  get quaduniforms(){
    const obj={};
    obj[this.id+'minmax'] = { data: this.minmax, type: 'float' };
    obj[this.id+'att'] = { data: this.att, type: 'float' };
    return obj;
  }
  get buffers(){return {values:this.buffer};}
  get uniforms(){return extend(this.layer.uniforms,{minmax:{ data: this.minmax, type: 'float' },u_res:{ data: [this.geometry.res], type: 'float' }});}
  
  addPrograms(){
    this.addProgram('fill','program',{vs:Shaders.vs[this.app.framework].default,fs:Shaders.fs.default});
    this.addProgram('line','program',{vs:Shaders.vs[this.app.framework].default,fs:Shaders.fs.default});
    this.addProgram('circle','program',{vs:Shaders.vs[this.app.framework].default,fs:Shaders.fs.circle});
    return this;
  }
  addProgram(id,type,options){
    if(id in this.programs)throw new Error("Id already exist");
    const _programs={quad:ProgramQuad,program:Program};
    this.programs[id]=new _programs[type](extend({id:id,attribute:this},extend(options,this.pstyles[id])));
    return this.programs[id];
  }
  getProgram(id){
    if(!this.programs[id])throw new Error("Program does not exist");
    return this.programs[id];
  }
  async getData(){
    if(!this.value){
      const value = new Float32Array(this.geometry.npoints);
      for(let i=0;i<this.geometry.npoints;i++)value[i]=i/this.geometry.npoints;
      this.setValue(value);
    }    
  }
  setValue(value){
    if(this.geometry.npoints!=value.length)return null;
    const {gl} = this,
      res  = this.geometry.res;
    
    this.value   = value;
    this.buffer  = {data:createArrayBuffer(gl, value),numComponents:1};
    this.minmax  = [value.min(),value.max()];
    this.texture = new Texture({gl:gl,width:res,height:res,min:this.minmax[0],max:this.minmax[1],rawdata:value});
  }
  
  
  
  drawScene() {
    if(!this.active)return;
    const programs=this.programs;
    const keys = Object.keys(programs).sort((a,b)=>{return programs[a].zorder-programs[b].zorder;});
    for(let i=0;i<keys.length;i++){
      programs[keys[i]].drawScene();
    }
  }

}
