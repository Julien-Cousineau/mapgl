import vs  from './vs/vs.glsl';
import vs_quad  from './vs/quad.glsl';
import vs_fquad  from './vs/fquad.glsl';
import vs_mapbox  from './vs/mapbox.glsl';
import vs_mapbox_fquad  from './vs/mapbox_fquad.glsl';

import fs  from './fs/fs.glsl';
import fs_circle  from './fs/circle.glsl';
import fs_quad  from './fs/quad.glsl';
import fs_mca  from './fs/mca.js';

export default {
  vs:{
    quad:vs_quad,
    canvas:{
      default:vs,
      fquad:vs_fquad,
    },
    mapbox:{
      default:vs_mapbox,
      fquad:vs_mapbox_fquad,
    },
  },
  fs:{
    default:fs,
    circle:fs_circle,
    quad:fs_quad,
    mca:fs_mca,
  }

};