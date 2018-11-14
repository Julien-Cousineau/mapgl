export default function(options){
  options=options || {};
  options=options.data||options;
  const xmin = (typeof options.xmin==='undefined')?-1:options.xmin;
  const xmax = (typeof options.xmax==='undefined')?1:options.xmax;
  const ymin = (typeof options.ymin==='undefined')?-1:options.ymin;
  const ymax = (typeof options.ymax==='undefined')?1:options.ymax;
  const xstep = options.xstep || 1;
  const ystep = options.ystep || 1;
  
  const xlen = Math.ceil((xmax-xmin) / parseFloat(xstep)+1);
  const ylen = Math.ceil((ymax-ymin) / parseFloat(ystep)+1);
  const n = xlen*ylen;
  
  const x = new Float32Array(n);
  const y = new Float32Array(n);
  const points = new Float32Array(n*2);
  let i=0;
  for(let _y=0;_y<ylen;_y++){
    for(let _x=0;_x<xlen;_x++){
      points[i*2+0]=x[i]=(_x * parseFloat(xstep))+xmin;
      points[i*2+1]=y[i]=(_y * parseFloat(ystep))+ymin;
      i+=1;
    }
  }
  
  let n1,n2,n3,n4,e=0;
  let ikle=new Uint32Array(((ylen-1)*(xlen-1))*2*3);
  for(let i=0;i<(ylen-1);i++){
    for(let j=0;j<(xlen-1);j++){
      n1=j+i*ylen;
      n2=(j+1)+i*ylen;
      n3=j+(i+1)*ylen;
      n4=(j+1)+(i+1)*ylen;
      ikle[e+0]=n1;
      ikle[e+1]=n3;
      ikle[e+2]=n2;
      ikle[e+3]=n2;
      ikle[e+4]=n3;
      ikle[e+5]=n4;
      e+=6;
    }
  }
  let iklew = new Uint32Array(ikle.length*2);
  for(let i=0,j=0,k=0;i<ikle.length/3;i++,j+=6,k+=3){
    iklew[j] =  ikle[k];
    iklew[j+1] = ikle[k+1];
    iklew[j+2] = ikle[k+1];
    iklew[j+3] = ikle[k+2];
    iklew[j+4] = ikle[k+2];
    iklew[j+5] = ikle[k];
  }
  
  return {positionNumComponents:2,position:points,indices:ikle,windices:iklew,x:x,y:y};
}