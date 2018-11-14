
import {draw,createProgram} from '../helper';
const {extend} = require('@julien.cousineau/util');
import Shaders from '../shaders';
import Texture from '../texture';
import PStyle from '../style/program.js';
export default class Program extends PStyle{
  constructor(options){
    super(options);
    if(!options.attribute)throw new Error("Attribute must be defined");
    this.id         = options.id;
    this.attribute  = options.attribute;
    this.vs         = options.vs || Shaders.vs[this.app.framework].default;
    this.fs         = options.fs || Shaders.fs.default;
    this._textures  = {t_color:new Texture({gl:this.gl,glslvarname:'dtexture'})};
    this.mode       = this.getMode(this.id);
    this.program    = createProgram(this.gl, this.vs, this.fs);
    this.program.mode=this.mode;
  }
  get app(){return this.layer.app;}
  get layer(){return this.attribute.layer;}
  get geometry(){return this.layer.geometry;}
  get gl(){return this.attribute.gl;}
  get framework(){return this.layer.framework;}
  get uniforms(){return extend(this.attribute.uniforms,{base:{ data: [this.paint.exponent], type: 'float' }});}
  get buffers(){return extend(this.attribute.buffers,this.geometry.getBuffers(this.id));}
  get textures(){return extend(this._textures,{fbtexture:this.attribute.fbtexture});}
  get indices(){return this.geometry.getIndices(this.id);}
  get npoints(){return this.geometry.npoints;}

  setSource(vs,fs){
    this.vs = vs;
    this.fs = fs;
    this.program=createProgram(this.gl, this.vs, this.fs);    
  }
  drawScene(){
    if(!this.active)return;
    this.checkGradient();
    draw(this);
  }
  checkGradient(){
    if(!this.textures.t_color.gradient!=this.paint.mapglcolor)this.setGradient(this.paint.mapglcolor);
  }
  setGradient(obj){
    this.textures.t_color.updateGradient(obj);
  }
  getMode(id){
    const modes = {circle:'POINTS',line:"LINES",fill:"TRIANGLES",quad:"TRIANGLES"};
    if(!modes[id])throw new Error("Mode does not exist");
    return modes[id];
  }
}

