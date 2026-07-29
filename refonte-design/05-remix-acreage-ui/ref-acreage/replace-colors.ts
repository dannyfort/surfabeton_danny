import fs from 'fs';

const files = ['public/beetle.json', 'public/curry.json', 'public/tractor.json'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let data = fs.readFileSync(file, 'utf8');
    
    // Replace black [0,0,0,1] with white [1,1,1,1]
    data = data.replace(/\[0,0,0,1\]/g, '[1,1,1,1]');
    
    // Replace teal [0.20000000298,0.800000011921,0.800000011921,1] with white 56% [1,1,1,0.56]
    data = data.replace(/\[0\.20000000298,0\.800000011921,0\.800000011921,1\]/g, '[1,1,1,0.56]');
    
    // Replace another teal variant [0.2,0.8,0.8,1] with white 56% [1,1,1,0.56]
    data = data.replace(/\[0\.2,0\.8,0\.8,1\]/g, '[1,1,1,0.56]');
    
    // Replace red [1,0,0,1] with white [1,1,1,1] (found in tractor.json)
    data = data.replace(/\[1,0,0,1\]/g, '[1,1,1,1]');
    
    fs.writeFileSync(file, data);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
