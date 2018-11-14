import {extend} from '@julien.cousineau/util';
export default  class Layout {
  constructor(options){
    options=options || {};
    if(!options.program)throw new Error("Layout needs style pointer");
    this.program = options.program;
      
    this.image = options.image || null;
    this.size = options.size || null;
    this.url = options.url || null;
  }
  get type(){return this.style.type;}
  get obj(){
    const {image,size,url}=this;
    return {image:image,size:size,url:url};
  }

  toJSON(){return JSON.stringify(this.obj);}
  get mapboxobj(){
    let obj={};
    if(!this.program.layer.active){obj=extend(obj,{visibility:'none'});}
    else{obj=extend(obj,{visibility:this.program.active ?'visible':'none'});}    
    obj=extend(obj,(this.type=='symbol')?this.symbol:{});
    return obj  ;
  }
  
  get symbol(){
    let obj={'icon-allow-overlap':true};
    if(this.image)obj['icon-image']=this.image;
    if(this.size)obj['icon-size']=this.size;
   
    return obj;      
  }

  setProperty(_prop,value){
    let prop=_prop.split('-');
    prop = (prop.length == 1)?_prop:prop[1];
    if(typeof this[prop]==='undefined')throw new Error("Prop does not exist");
    this[prop]=value;
  }

 
  
}