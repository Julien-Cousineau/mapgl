// import {debounce} from '@julien.cousineau/util';
export default class Handlers{
  constructor(options){
    if(!options || !options.callback)throw new Error("Must contain callback function");
    // if(!options || !options.element)throw new Error("Must contain element");
    // this.element = options.element;
    this.callback = options.callback;
    // this.element=options.element;
    this.debug=options.debug || false;
    this.xfactor=options.xfactor || 1;
    this.xshiftfactor=options.xshiftfactor || 10;
    this.yfactor=options.yfactor || 1;
    this.yshiftfactor=options.yshiftfactor || 10;
    this.zoomfactor=options.zoomfactor || 1;
    this.zoomshiftfactor=options.zoomshiftfactor || 10;
    this.initialize();
  }

  initialize(){
    const self=this;
    // const {element} = this;
    document.onmousedown = function(e){return self.onmousedown(e);};
    document.addEventListener('mousemove',function(e){return self.onmousemove(e);},false);
    document.onmouseup   = function(e){return self.onmouseup(e);};
    document.touchstart = function(e){return self.onmousedown(e);};
    document.touchend = function(e){return self.onmouseup(e);};
    document.touchcancel = function(e){return self.onmouseup(e);};
    document.touchmove = function(e){return self.onmousemove(e);};
    document.mousewheel  = function(e){return self.onwheelmove(e);};
    document.onwheel     = function(e){return self.onwheelmove(e);};
    document.onkeydown   = function(e){return self.onkeydown(e);};
  }
  get position(){
    return {
      xy:{
        x:this.lastMouseX,
        y:this.lastMouseY,
      },
      delta:{
        x:this.deltaX,
        y:this.deltaY,
        z:this.deltaZ,
        zoom:this.deltaZoom,
      }
    };
  }
  onkeydown(e){
    // if(this.debug)console.log(e);
    e = e || window.event;
    const isShift = !!e.shiftKey;
    switch(e.keyCode){
    case 38: // up  arrow
      this.resetDelta();
      this.deltaY = isShift ? this.yshiftfactor:this.yfactor;
      this.callback(this.position);
      break; 
    case 40: // down  arrow
      this.resetDelta();
      this.deltaY = isShift ? -this.yshiftfactor:-this.yfactor;
      this.callback(this.position);
      break;
    case 37: // left  arrow
      this.resetDelta();
      this.deltaX = isShift ? -this.xshiftfactor:-this.xfactor;
      this.callback(this.position);
      break;
    case 39: // right  arrow
      this.resetDelta();
      this.deltaX = isShift ? this.xshiftfactor:this.xfactor;
      this.callback(this.position);
      break;
    }
  }
  onmousedown(e){
    if(this.debug)console.log(e);
    this.mouseDown = true;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  }
  onmouseup(e) {
    if(this.debug)console.log(e);
    this.mouseDown = false;
    this.getNewPosition(e.clientX,e.clientY);
  }
  onmousemove(e) {
    // if(this.debug)console.log(e);
    if (!this.mouseDown) return;
    this.getNewPosition(e.clientX,e.clientY);      
  }
  onwheelmove(e){
    if(this.debug)console.log(e);
    this.resetDelta();
    const isShift = !!e.shiftKey;
    this.deltaZ = isShift ? -e.deltaY*this.zoomshiftfactor: -e.deltaY*this.zoomfactor;
    this.callback(this.position);
  }
  resetDelta(){
    this.deltaX = 0.0;
    this.deltaY = 0.0;
    this.deltaZ = 0.0;
    this.deltaZoom = 0.0;
  }
  getNewPosition(newX,newY){
    this.resetDelta();
    this.deltaX = newX - this.lastMouseX;
    this.deltaY = newY - this.lastMouseY;
    this.lastMouseX = newX;
    this.lastMouseY = newY;
    this.callback(this.position);
  }

}