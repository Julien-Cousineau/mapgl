import {Geometry} from '../geometry';
import { extend } from '@julien.cousineau/util';
import {Attribute,AttributeQuad,AttributeSLF} from '../attribute';
import {LStyle} from '../style';
import Primitive from './primitive';

export default class Layer extends LStyle {
  constructor(options) {
    super(options);
    if(!options.app)throw new Error("Layer must contain app"); 
    this.id         = options.id;
    this.app        = options.app;
    this.geometry   = null;
    this.attributes = {};
  }
  get gl(){return this.app.gl;}
  get uniforms(){return extend(this.app.uniforms,{});}
  
  addAttribute(id,type){
    if(this.attributes[id])throw new Error("id already exist");
    const _attributes={attribute:Attribute,quad:AttributeQuad,slf:AttributeSLF};
    const _attribute = _attributes[type] || _attributes['attribute'];
    this.attributes[id]=new _attribute(extend({id:id,layer:this},this.astyles[id])).addPrograms();
    return this.attributes[id];
  }
  getAttribute(id){
    if(!this.attributes[id])return console.warn("Attribute does not exist");
    return this.attributes[id];
  }
  async getGeometry(){
    if(!this.geometry){
      const geometry = Primitive[this.type] || Primitive['points'];
      this.geometry = new Geometry(extend({gl:this.gl},geometry(this.source)));
      this.addAttribute('value','attribute');
      if(this.source.type && this.source.type=='quad')this.addAttribute('myquad','quad');
    }
  }
  async getData(){
    if(!this.active)return;
    await this.getGeometry();
    for (const id in this.attributes) {
      if (this.attributes[id].active || this.attributes[id].attactive)await this.attributes[id].getData();
    }
  }
  drawScene() {
    if(!this.active)return;
    
    const attributes=this.attributes;
    const array = Object.keys(attributes).map(key=>attributes[key]).filter(attribute=>attribute.active);
    if(array.length==0)return;
    const maxzorder =array.reduce((prev, current)=>(prev.zorder > current.zorder) ? prev : current).zorder;
    const newarray =array.filter(sattribute=>sattribute.zorder>=maxzorder);
    newarray.sort((a,b)=>b.zorder-a.zorder);
    const att = newarray[newarray.length-1];
    att.drawScene();
  }
}
