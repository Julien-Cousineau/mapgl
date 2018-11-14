import { createTexture,updateTexture } from '../helper';

export default class GLTexture {
  constructor(options) {
    options = options|| {};
    if (!options.gl) throw new Error("GLSurface must contain gl");
    this.gl = options.gl;
    this.width = options.width || 32;
    this.height = options.height || 32;
    this.max = options.max || 1.0;
    this.min = options.min || 0.0;
    this.glslvarname = options.glslvarname || null;
    if (options.rawdata) {
      this.values = this.rawdata2value(options.rawdata);
    }
    else {
      this.values = options.values || new Uint8Array(this.width * this.height * 4);

    }
    this.buffer = createTexture(this.gl, this.gl.LINEAR, this.values, this.width, this.height);
    this.gradient=null;
    // this.values = options.values;
    // this.rawdata = options.rawdata;

    this.defaultRampColors = {
      0.0: '#3288bd',
      0.1: '#66c2a5',
      0.2: '#abdda4',
      0.3: '#e6f598',
      0.4: '#fee08b',
      0.5: '#fdae61',
      0.6: '#f46d43',
      1.0: '#d53e4f'
    };
  }

  rawdata2value(rawdata) {
    const values = new Uint8Array(this.width * this.height * 4);
    for (let ird = 0, ip = 0; ird < rawdata.length; ird++, ip += 4) {
      const encode = this.encode(rawdata[ird]);
      values[ip] = encode[0];
      values[ip + 1] = encode[1];
      values[ip + 2] = 0;
      values[ip + 3] = 255;
    }
    return values;
  }
  get values() { return this._values; }
  set values(values) {
    if (values.length != this.width * this.height * 4) throw new Error("Values must match dimension of texture");
    this._values = values;
  }
  todefaultcolor() {
    this.gradient = this.defaultRampColors;
    this.values = this.getColorRamp(this.defaultRampColors);
    if(this.buffer)this.delete();
    this.buffer = createTexture(this.gl, this.gl.LINEAR, this.values, this.width, this.height);
  }

  delete() {
    this.gl.deleteTexture(this.buffer);
  }
  updateGradient(obj){
    // obj = (typeof obj==='string')?{0:obj,1:obj}:obj;
    // obj = (obj && obj.constructor && obj.constructor.name==='Gradient')?obj.obj:obj;
    this.gradient=obj;
    this.values = this.getColorRamp(obj);
    // if(this.buffer)this.delete();
    // this.buffer = createTexture(this.gl, this.gl.LINEAR, this.values, this.width, this.height);
    updateTexture(this.gl,this.buffer,this.gl.LINEAR, this.values, this.width, this.height);
  }

  getColorRamp(colors) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = this.width * this.height;
    canvas.height = 1;

    const gradient = ctx.createLinearGradient(0, 0, this.width * this.height, 0);
    for (const stop in colors) {
      gradient.addColorStop(+stop, colors[stop]);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width * this.height, 1);

    return new Uint8Array(ctx.getImageData(0, 0, this.width * this.height, 1).data);
  }
  putImageData(ctx) {
    const dx = ctx.canvas.width / this.width;
    const dy = ctx.canvas.height / this.height;
    var values = this.values;
    var height = this.height;
    var width = this.width;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let pos = y * width + x;
        ctx.fillStyle = 'rgba(' + values[pos * 4 + 0] +
          ',' + values[pos * 4 + 1] +
          ',' + values[pos * 4 + 2] +
          ',' + (values[pos * 4 + 3] / 255) + ')';
        ctx.fillRect(x * dx, ctx.canvas.height - (y + 1) * dy, dx, dy);
      }
    }
  }
  encode(value) {
    const { max, min } = this;
    value = (value - min) / (max - min) * 255 * 255;
    return [Math.round(value % 255.0), Math.floor(value / 255.0)];
  }
  decode(pair) {
    const { max, min } = this;
    const y = pair[0];
    const x = pair[1] * 255.0;
    return (y + x) / 255.0 / 255.0 * (max - min) + min;

  }
  decodeImage() {
    let { values, height, width } = this;
    let newarray = new Float32Array(this.width * this.height);
    let index = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let pos = y * width + x;
        newarray[index++] = this.decode([values[pos * 4 + 0], values[pos * 4 + 1]]);
      }
    }
    return newarray;
  }

}
