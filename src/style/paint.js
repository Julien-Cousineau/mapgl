import {Gradient,Color} from '@julien.cousineau/util';
export default class Paint {
  constructor(options){
    options=options || {};
    this.program    = options.program;
    this.color      = options.color    || Color.parseString('white').rgba2str();
    this.minmax     = options.minmax   || [0,1];
    this.exponent   = options.exponent || 1.0;
    this.gradient   = Gradient.parse(options.gradient || "Skyline");
    this.colorbyatt = (typeof options.colorbyatt ==='undefined')?false: options.colorbyatt;
    this.opacity    = (typeof options.opacity === 'undefined') ? 1 : options.opacity;
    this.outlinecolor = options.outlinecolor || Color.parseString('white').rgba2str();
    this.cap        = options.cap || 'butt'; 
    this.join       = options.join || 'miter';
    this.width      = (typeof options.width === 'undefined') ? 5 : options.width;
    this.radius     = (typeof options.radius === 'undefined') ? 5 : options.radius;
    this.radiusbyatt= (typeof options.radiusbyatt ==='undefined')?false: options.radiusbyatt;
    this.radiusatt  = options.radiusatt || this.radius;
    this.blur       = (typeof options.blur === 'undefined') ? 0 : options.blur;
    this.dasharray  = options.dasharray || null;
  }
  get layer(){return this.attribute.layer;}
  get attribute(){return this.program.attribute;}
  get type(){return this.program.type;}
  get activeatt(){return this.layer.activeatt;}
  get obj(){
    const {color,minmax,exponent,gradient,colorbyatt,opacity,outlinecolor,cap,join,width,radius,blur}=this;
    return {color:color,minmax:minmax,exponent:exponent,gradient:gradient.obj,colorbyatt:colorbyatt,opacity:opacity,outlinecolor:outlinecolor,cap:cap,join:join,width:width,radius:radius,blur:blur};
  }
  toJSON(){return JSON.stringify(this.obj);}
  get mapboxobj(){
    return this[this.type]; 
  }
  
  

  get colorType(){
    if(typeof this.color==='string')return 'color';
    return 'stops';
  }
  get mapboxcolor(){
    if(!this.colorbyatt)return this.color;
    const min=this.minmax[0];
    const max=this.minmax[1];
    const obj= {
      property:this.activeatt,
      type:'exponential',
      base:this.exponent,
      stops:[[min,this.gradient.interpolate(0)],[max,this.gradient.interpolate(1)]]
    };
    return obj;
  }
  get mapglcolor(){
    if(!this.colorbyatt)return {0:this.color,1:this.color};
    return this.gradient.obj;
  }
  get mapboxradius(){
    if(!this.radiusbyatt)return this.radius;
    const obj={
      property:this.activeatt,
      type:'exponential',
      base:this.exponent,
      stops:this.radiusatt
    };
    return obj;
    
  } 
  
  
  // static parseRadius(array,options){
  //   if(!array)return Color.parseString('#000000').rgba2str();
  // }
  static parseColor(array,options){
    if(!array)return Color.parseString('#000000').rgba2str();
    options=options||{};
    
    if(!options.gradient)options.gradient=Gradient.parseName('Skyline');
    if(!options.attributename)throw new Error("requires attributename");
    if(!options.base)options.base=1.0;
    if(Array.isArray(array) || array.byteLength !== undefined){
      if(typeof array[0]==='string')return this.parseCategoricalColor(array,options);
      if(typeof array[0]==='number')return this.parseLinearColor(array,options);
      if(Array.isArray(array[0]))return this.parseStopsColor(array,options);
      
    }
    if(typeof array === 'object') return this.parseObjectColor(array,options);
    return null;
    
    
  }
  static parseCategoricalColor(array,options){
    let {gradient,attributename} = options;
    const stops = array.map((item,i,array)=>[item,gradient.interpolate(parseFloat(i)/array.length)]);
    return {
      property:attributename,
      type:'categorical',
      stops:stops
    };
  }
  static parseLinearColor(array,options){
    let {base,gradient,attributename} = options;
    const min=array.min();
    const max=array.max();
    return {
      property:attributename,
      type:'exponential',
      base:base,
      stops:[[min,gradient.interpolate(0)],[max,gradient.interpolate(1)]]
    };
  }
  static color2Texture(obj){
    if(typeof obj=='string')return {base:1,gradient:{0:obj,1:obj}};
    const gradient = {};
    obj.stops.forEach(stop=>gradient[stop[0]]=stop[1]);
    return {base:obj.base,gradient:gradient};
  }
  static parseStopsColor(stops,options){
   
    let {base,gradient,attributename} = options;
    const newstops=stops.map(stop=>[stop[1],gradient.interpolate(stop[0])]);
    return {
      property:attributename,
      type:'exponential',
      base:base,
      stops:newstops
    };
  }
  static parseObjectColor(obj,options){
  
    let {base,gradient,attributename} = options;
    const min = obj.min || 0;
    const max = obj.max || 1;
    return {
      property:attributename,
      type:'exponential',
      base:base,
      stops:[[min,gradient.interpolate(0)],[max,gradient.interpolate(1)]]
    };
  }    
  get circle(){
    const obj={};
    obj['circle-color']=this.mapboxcolor;
    obj['circle-opacity']=this.opacity;
    obj['circle-radius']=this.mapboxradius;
    obj['circle-blur']=this.blur;
    return obj;
      
  }
  get fill(){
    const obj={};
    obj['fill-color']=this.mapboxcolor;
    obj['fill-opacity']=this.opacity;
    obj['fill-outline-color']=this.outlinecolor;
    return obj;      
  }  
  get line(){
    const obj={};
    obj['line-color']=this.mapboxcolor;
    obj['line-opacity']=this.opacity;
    obj['line-width']=this.width;
    if(this.dasharray)obj['line-dasharray']=this.dasharray;
    return obj;      
  }
  get symbol(){
    const obj={};
    obj['icon-color']=this.mapboxcolor;
    return obj;      
  }

  setProperty(prop,value){
    if(typeof this[prop]==='undefined')throw new Error("Prop does not exist");
    this[prop]=value;
  }
 
  
}