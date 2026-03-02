const fs=require("fs"); const d=JSON.parse(fs.readFileSync("_vi_data.json","utf8")); for(const[f,c]of Object.entries(d)){fs.writeFileSync(f,c,"utf8");console.log("OK",f.split("/").pop());}
