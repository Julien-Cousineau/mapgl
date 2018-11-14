export default function(options){
  options = options || {};
  console.log(options);
  const type = options.type || 'uniform'; // uniform,random
  if(type=='uniform')return uniform(options.data);
  return random(options.data);
}
function random(options){
  options=options || {};
  const xmin = (typeof options.xmin==='undefined')?-1:options.xmin;
  const xmax = (typeof options.xmax==='undefined')?1:options.xmax;
  const ymin = (typeof options.ymin==='undefined')?-1:options.ymin;
  const ymax = (typeof options.ymax==='undefined')?1:options.ymax;
  const xrange = xmax-xmin;
  const yrange = ymax-ymin;
  const npoints = options.npoints || 100;
  const points = new Float32Array(npoints*2);
  for(let i=0;i<npoints;i++){
    points[i*2+0]=Math.random()*xrange+xmin;
    points[i*2+1]=Math.random()*yrange+ymin;
  }
  return {positionNumComponents:2,position:points};
}
function uniform(options){
  options=options || {};
  const xmin = (typeof options.xmin==='undefined')?-1:options.xmin;
  const xmax = (typeof options.xmax==='undefined')?1:options.xmax;
  const ymin = (typeof options.ymin==='undefined')?-1:options.ymin;
  const ymax = (typeof options.ymax==='undefined')?1:options.ymax;
  const xstep = options.xstep || 0.1;
  const ystep = options.ystep || 0.1;
  
  const xlen = Math.ceil((xmax-xmin) / parseFloat(xstep)+1);
  const ylen = Math.ceil((ymax-ymin) / parseFloat(ystep)+1);
  const n = xlen*ylen;
  
  
  const points = new Float32Array(n*2);
  let i=0;
  for(let _y=0;_y<ylen;_y++){
    for(let _x=0;_x<xlen;_x++){
      points[i*2+0]=(_x * parseFloat(xstep))+xmin;
      points[i*2+1]=(_y * parseFloat(ystep))+ymin;
      i+=1;
    }
  }
  return {positionNumComponents:2,position:points};
}