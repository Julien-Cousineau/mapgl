import Attribute from './attribute.js';
import Shaders from '../shaders';

export default class AttributeQuad extends Attribute {
  constructor(options) {
    super(options);
    this.type = 'quad';
  }
  addPrograms(){
    const quad = this.addProgram('quad','quad',{vs:Shaders.vs.quad,fs:Shaders.fs.quad});
    this.fbtexture = quad.fbtexture;
    this.addProgram('fill','program',{vs:Shaders.vs[this.app.framework].fquad,fs:Shaders.fs.default});
    this.addProgram('line','program',{vs:Shaders.vs[this.app.framework].fquad,fs:Shaders.fs.default});
    this.addProgram('circle','program',{vs:Shaders.vs[this.app.framework].fquad,fs:Shaders.fs.circle});
    return this;
  }
  async getData(){return;}
}
