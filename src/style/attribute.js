import {extend} from '@julien.cousineau/util';
import Style from './default.js';

export default  class AStyle extends Style  {
  constructor(options){
    super(options);
    options=options||{};
    this.attactive = (typeof options.attactive === 'undefined') ? false : options.attactive; 
    this.att       = options.att || [0,1,1.0,1.0];
    this.w         = options.w || 0;
    this.range     = options.range || [0,100];
    this.units     = options.units || 'Unknown';
    this.xlabel    = options.xlabel || "Unknown";
    this.pstyles   = options.pstyles || [];
  }
  get weight(){return this.att[3]*100.0;}
  set weight(value){this.att[3]=value*0.01;}
  get obj(){
    const {attactive,att,w,range,units,xlabel,pstyles}=this;
    const _pstyles = {};
    for(const id in pstyles)_pstyles[id]=pstyles[id].obj;
    return extend(super.obj,{attactive:attactive,att:att,w:w,range:range,units:units,xlabel:xlabel,pstyles:pstyles});
  }
  toJSON(){return JSON.stringify(this.obj);}
}