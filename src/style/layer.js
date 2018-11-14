import {extend} from '@julien.cousineau/util';
import Style from './default.js';

export default  class LStyle extends Style  {
  constructor(options){
    super(options);
    options=options||{};
    this.type        = options.type || 'point';
    this.category    = options.category || 'general';
    this.activeatt   = options.activeatt|| null;
    this.refsource   = options.refsource || 'unknown';
    this.htmltext    = options.htmltext || 'Sample Here';
    this.description = options.description || 'description';
    this.source      = options.source || {type:'geojson',data:"unknown"};
    this.astyles  = options.astyles || [];
  }
  get obj(){
    const {type,category,activeatt,refsource,htmltext,description,source,astyles}=this;
    const _astyles = {};
    for(const id in astyles)_astyles[id]=astyles[id].obj;
    return extend(super.obj,{type:type,category:category,refsource:refsource,htmltext:htmltext,description:description,activeatt:activeatt,source:source,attributes:_astyles});
  }
  toJSON(){return JSON.stringify(this.obj);}
  
}