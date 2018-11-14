import Attribute from './attribute.js';

export default class AttributeSLF extends Attribute {
  constructor(options) {
    super(options);
  }
  get slf(){return this.layer.slf;}
  async getData(){
    if(!this.value){
      const {slf}=this;
      const index = slf.getVarIndex(this.id);
      const value = await slf.getFrame(0,index);
      this.setValue(value);
    }    
  }
}
