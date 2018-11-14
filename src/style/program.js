import {extend} from '@julien.cousineau/util';
import Style from './default.js';
import Paint from './paint.js';
import Layout from './layout.js';

export default  class StyleProgram extends Style  {
  constructor(options){
    super(options);
    options=options||{};
    this.attribute = options.attribute;
    this.type = options.type || 'circle'; // 'circle',line','fill','contour'
    this.paint  = new Paint(extend({program:this},options.paint));
    this.layout = new Layout(extend({program:this},options.layout));
    this.filter = options.filter || null;  
    this.legendactive = (typeof options.legendactive === 'undefined') ? false : options.legendactive;
      
  }
  get obj(){
    const {type,paint,layout,filter}=this;
    return extend(super.obj,{type:type,paint:paint.obj,layout:layout.obj,filter:filter});
  }
  toJSON(){return JSON.stringify(this.obj);}
  setPaint(paint){this.paint = new Paint(extend({program:this},paint));}
  setLayout(layout){this.layout = new Layout(extend({program:this},layout));}
  setFilter(filter){this.filter = filter;}
}