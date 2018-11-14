import Handlers from './handlers.js';
import {initialisedView,changePView,changeMView} from '../helper';
const {extend} = require('@julien.cousineau/util');


export default class Camera{
  constructor(options){
    options=options || {};
    if(!options.app)throw new Error("Must contain _app");
    this.app             = options.app;
    this.modelview       = options.modelview || {x:0.,y:0.,z:-10.0};
    this.perspectiveview = options.perspectiveview || {fieldOfView : 45 * Math.PI / 180,aspect : this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,zNear : 0.01,zFar : 1000.0};
    
    [this.u_matrix,this.v_matrix] = initialisedView(this.gl,this.modelview,this.perspectiveview);
    
    this.handlers   = new Handlers({element:this.app.canvasgl,debug:false,callback:(position)=>this.changeView(position)});
    window.onresize = (e)=>this.onresize(e);  
    
    this.changePView();
    this.changeMView();
  }
  get gl(){return this.app.gl;}
  
  onresize(){
    const {height,width} = this.app.canvasglparent.node().getBoundingClientRect();
    this.app.canvasgl.attr('width', width);
    this.app.canvasgl.attr('height', height);

    this.changePView();
    this.app.drawSceneAsync();
  }
  changeView(position){
    this.changeMView(position.delta);
    this.app.drawSceneAsync();
  }
  changePView(options){
    const pv  = this.perspectiveview = extend(this.perspectiveview, options);
    changePView(this.gl,this.u_matrix,pv);
  }
  changeMView(options){
    const mv  = this.modelview = extend(this.modelview, options);    
    changeMView(this.gl,this.u_matrix,this.v_matrix,mv);
  }
}