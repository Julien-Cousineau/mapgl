const {mat4,vec3} = require("gl-matrix");

const createShader=  function(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
};
module.exports.createShader = createShader;

module.exports.createProgram= function(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram();

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,fragmentSource);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }

  const wrapper = { program: program,attributes:{},uniforms:{},textures:{}};

  const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < numAttributes; i++) {
    const attribute = gl.getActiveAttrib(program, i);
    wrapper.attributes[attribute.name] = gl.getAttribLocation(program, attribute.name);
  }
  const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < numUniforms; i++) {
    const uniform = gl.getActiveUniform(program, i);
    if(uniform.type == 35678){wrapper.textures[uniform.name] = gl.getUniformLocation(program, uniform.name);}
    else {wrapper.uniforms[uniform.name] = gl.getUniformLocation(program, uniform.name);}                   
  }
  return wrapper;
};

module.exports.createTexture= function(gl, filter, data, width, height) {
  const texture = gl.createTexture();
  return updateTexture(gl,texture, filter, data, width, height);
};
const updateTexture = function(gl, texture,filter, data, width, height){
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  if (data instanceof Uint8Array) {
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,data);
  } else {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
  }
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
};
module.exports.updateTexture = updateTexture;

const bindTexture= function(gl,location, texture, unit) {        
  gl.activeTexture(gl.TEXTURE0 + unit);        
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(location, unit);
};
module.exports.bindTexture = bindTexture;

const bindTextures= function(gl,program, textures) {
  let unit=0;
  for(let id in program.textures){
    if(!textures[id])throw new Error(id + " Texture does not exist");
    bindTexture(gl,program.textures[id],textures[id].buffer,unit);
    unit++;
  }
};
module.exports.bindTextures=bindTextures;
const bindProgram=function(glprogram){
  const gl = glprogram.gl,
    program = glprogram.program,
    buffers = glprogram.buffers,
    uniforms = glprogram.uniforms,
    textures = glprogram.textures;        
    
  bindAttributes(gl,program,buffers);
  bindElement(gl, program,buffers);
  bindTextures(gl, program,textures);
  bindUniforms(gl, program,uniforms);
};
module.exports.bindProgram = bindProgram;

const unBindProgram=function(glprogram){
  const gl = glprogram.gl,
    program = glprogram.program;
    
  unBindAttributes(gl,program);
   
};
module.exports.unBindProgram = unBindProgram;


module.exports.draw=function(glprogram){
  const gl       = glprogram.gl;
  const program = glprogram.program;
  const indices = glprogram.indices;
  const npoints = glprogram.npoints;
        
  // geometry.wireframe = glprogram.wireframe;

  gl.useProgram(program.program);
  // gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);    
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  bindProgram(glprogram);
  (indices)?drawElements(gl,glprogram,indices):drawArrays(gl,glprogram,npoints);
  unBindProgram(glprogram);
  gl.useProgram(null);
};
module.exports.drawQuad=function(glprogram){
  const gl   = glprogram.gl;
  const program = glprogram.program;
  const fb   = glprogram.fb;
  gl.useProgram(program.program);
  bindFrameBuffer(gl,fb,glprogram.fbtexture);
  bindProgram(glprogram);
  gl.viewport(0, 0, glprogram.fbtexture.width, glprogram.fbtexture.height);
  gl.drawArrays(gl.TRIANGLES,0,6);
  readPixels(gl,glprogram.fbtexture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); 
  unBindProgram(glprogram);
  gl.useProgram(null);
};
const readPixels=function(gl,fbtexture){        
  fbtexture.values = new Uint8Array(fbtexture.width * fbtexture.height * 4);
  gl.readPixels(0, 0, fbtexture.width, fbtexture.height, gl.RGBA, gl.UNSIGNED_BYTE, fbtexture.values);
};
module.exports.readPixels = readPixels;

const drawElements=function(gl,glprogram,indices){
  gl.drawElements(gl[glprogram.mode],indices.nindices,indices.indiceType,0);
};
module.exports.drawElements = drawElements;  
const drawArrays=function(gl,glprogram,npoints){
  gl.drawArrays(gl[glprogram.mode],0,npoints);
};  
module.exports.drawArrays = drawArrays;

const bindUniforms =function(gl,program,uniforms){
  for(let id in program.uniforms){
    if(!uniforms[id]){
      throw new Error(id + " is not defined");
    }
    if(uniforms[id].type=='float'){
      const n = uniforms[id].data.length;
      switch(n){
      case(1):
        gl.uniform1fv(program.uniforms[id], uniforms[id].data);
        break;
      case(2):
        gl.uniform2fv(program.uniforms[id], uniforms[id].data);
        break;
      case(3):
        gl.uniform3fv(program.uniforms[id], uniforms[id].data);
        break;
      case(4):
        gl.uniform4fv(program.uniforms[id], uniforms[id].data);
        break;
      default:
        throw new Error("Error in array length " + id);
      } 
    } else if(uniforms[id].type=='matrix'){
      const n = uniforms[id].data.length;
      switch(n){
      case(4):
        gl.uniformMatrix2fv(program.uniforms[id],false, uniforms[id].data);
        break;
      case(9):
        gl.uniformMatrix3fv(program.uniforms[id],false, uniforms[id].data);
        break;
      case(16):
        gl.uniformMatrix4fv(program.uniforms[id],false, uniforms[id].data);
        break;
      default:
        throw new Error("Error in array length " + id);
      }
    }

  }    
};
module.exports.bindUniforms = bindUniforms;
module.exports.createArrayBuffer=function(gl, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buffer;
};
module.exports.createElementBuffer=function(gl, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  return buffer;
};
module.exports.updateElementBuffer = function(gl,buffer,data){
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, data);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  return buffer;
};

const bindArrayAttribute=function(gl, buffer, attribute, numComponents) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, numComponents, gl.FLOAT, false, 0, 0);
};
module.exports.bindArrayAttribute = bindArrayAttribute;

// const unBindArrayAttribute=function(gl, buffer, attribute, numComponents) {
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.disableVertexAttribArray(attribute);
//     gl.vertexAttribPointer(attribute, numComponents, gl.FLOAT, false, 0, 0);
//   }
// module.exports.unBindArrayAttribute = unBindArrayAttribute;


const bindAttributes=function(gl,program,buffers){
  const attributes = program.attributes;
  for(let id in attributes){
    if(!buffers[id])throw new Error("Buffer does not exist");
    bindArrayAttribute(gl, buffers[id].data, program.attributes[id], buffers[id].numComponents);
  }    
};
module.exports.bindAttributes = bindAttributes;

const unBindAttributes=function(gl,program){
  const attributes = program.attributes;
  for(let id in attributes){
    gl.disableVertexAttribArray(program.attributes[id]);
  }
};
module.exports.unBindAttributes = unBindAttributes;
const bindElement=function(gl,program,buffers){
  if(buffers.indices){
    bindElementAttribute(gl, buffers.indices.data);
  }
};
module.exports.bindElement=bindElement;

const bindElementAttribute=function(gl, buffer) {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
};
module.exports.bindElementAttribute = bindElementAttribute;



module.exports.createFrameBuffer=function(gl){
  const fb = gl.createFramebuffer();
  return fb;
};
const bindFrameBuffer=function(gl, fb,fbtexture) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);          
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    fbtexture.buffer,
    0
  );       
};
  
module.exports.bindFrameBuffer = bindFrameBuffer; 
module.exports.initialisedView=function(gl,mv){
    
  const u_matrix = mat4.create();
  const v_matrix = mat4.create();
  mat4.translate(v_matrix,v_matrix,[mv.x,mv.y,mv.z]);
  return [u_matrix,v_matrix];
};
module.exports.changePView=function(gl,u_matrix,pv){
  const canvas = gl.canvas;

  // Lookup the size the browser is displaying the canvas.
  canvas.width  = (canvas.width  != canvas.clientWidth) ? canvas.clientWidth:canvas.width;
  canvas.height = (canvas.height  != canvas.clientHeight) ? canvas.clientHeight:canvas.height;

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  pv.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  mat4.perspective(u_matrix,pv.fieldOfView,pv.aspect,pv.zNear,pv.zFar);
  // return u_matrix;
};
module.exports.changeMView=function(gl,u_matrix,v_matrix,mv){
  let x=mv.x,
    y=mv.y,
    z=mv.z;
  const pos = vec3.create();
  mat4.getTranslation(pos, v_matrix);

  const u_matrixI = mat4.create();
  mat4.invert(u_matrixI,u_matrix);

  const maxz = 1000.;
  const miz = 0.1;
  const scaleZ = pos[2];
  const scaleZI = -pos[2];
  const newx = scaleZ * u_matrixI[0] * 2 * x / gl.canvas.clientWidth;
  const newy = scaleZ * u_matrixI[5] * 2 * y / gl.canvas.clientHeight;


  const factor = (Math.pow(scaleZI,2.)/(Math.pow(scaleZI,2.)+100.))/10.;
  z = z*factor;
  z = (scaleZ+z<-maxz) ? 0:z;
  z = (scaleZ+z>-miz) ? 0:z;

  mat4.translate(v_matrix,v_matrix,[-newx, newy, z]);
  // return v_matrichangePViewx;
};
module.exports.clearRect=function(ctx){    
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};
module.exports.clearScene=function(gl){       
  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);                 // Clear everything
  // gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  // gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};