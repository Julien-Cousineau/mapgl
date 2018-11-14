export default class Style {
  constructor(options){
    options=options||{};
    this.id    = options.id    || "";
    this.title = options.title || "";
    this.active =(typeof options.active === 'undefined') ? false : options.active;
    this.zorder = options.zorder || 0;
  }
  get obj(){
    const {id,title,active,zorder}=this;
    return {id:id,title:title,active:active,zorder:zorder};
  }
  toJSON(){return JSON.stringify(this.obj);}
  toggle(){this.active = !this.active;}
  show(){this.active=true;}
  hide(){this.active=false;}
}