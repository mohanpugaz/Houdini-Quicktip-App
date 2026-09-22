const tips = [
  {
    category:"SOPs", title:"Connectivity + Partition",
    text:"After a Boolean, fracture, or other operation that creates disconnected islands, use Connectivity to create a class attribute and Partition to turn those classes into named groups.",
    why:"It gives you a clean piece/group workflow without a For-Each or custom VEX."
  },
  {
    category:"SOPs", title:"Attribute Blur without touching P",
    text:"Attribute Blur can smooth a custom attribute such as mask, pscale, density, or Cd while leaving the actual geometry position unchanged.",
    why:"Great for cleaning procedural masks and control attributes."
  },
  {
    category:"VEX", title:"Use nearpoint() for cheap nearest-point lookup",
    text:"When you only need the single closest point, nearpoint() is often simpler and cheaper than building a full proximity workflow.",
    code:'int pt = nearpoint(1, @P);\\nvector target = point(1, "P", pt);',
    why:"Perfect for snapping, target selection, and simple nearest-neighbour relationships."
  },
  {
    category:"Attributes", title:"Detail attributes are global variables",
    text:"A detail attribute exists once for the whole geometry, so it is useful for storing values such as counts, transforms, bounds, or tool settings that every point/primitive can access.",
    why:"It keeps global tool state separate from per-element attributes."
  },
  {
    category:"SOPs", title:"Blast can delete by expression",
    text:"Blast is not limited to groups. Its deletion expression can make it a quick visual filtering tool when you want to remove elements based on an attribute or condition.",
    why:"Sometimes this is faster to read and maintain than a one-line wrangle."
  },
  {
    category:"VEX", title:"setpointattrib() can accumulate",
    text:"When multiple points contribute to the same target point, use the 'add' mode of setpointattrib() instead of manually reading and writing the attribute.",
    code:'setpointattrib(0, "force", targetpt, contribution, "add");',
    why:"Very useful for procedural accumulation and custom solvers."
  },
  {
    category:"SOPs", title:"Fuse has a useful Match Attribute mode",
    text:"Fuse can use attributes to control which points are allowed to fuse. This lets you prevent unrelated procedural pieces from accidentally welding together.",
    why:"Useful after copying, scattering, and combining independently generated geometry."
  },
  {
    category:"Geometry", title:"Measure SOP can create useful scale-independent attributes",
    text:"Measure can generate perimeter, area, or curvature-related information that you can immediately use downstream for procedural decisions.",
    why:"It can replace surprisingly large amounts of custom geometry analysis."
  },
  {
    category:"Solaris", title:"Collections are more than organization",
    text:"LOP Collections can act as reusable selectors for lights, assets, render geometry, or arbitrary USD prim sets.",
    why:"Build selectors once and reuse them across lighting and render operations instead of repeatedly writing paths."
  },
  {
    category:"Karma", title:"Render Visibility is an attribute-driven control",
    text:"For procedural USD scenes, controlling visibility through attributes or USD prim properties can be cleaner than physically deleting geometry.",
    why:"You preserve the scene structure while controlling what Karma actually renders."
  },
  {
    category:"SOPs", title:"Attribute Promote is a design tool",
    text:"You can promote point data to primitive, vertex, or detail data using operations such as average, maximum, minimum, or sum.",
    why:"It is an easy way to turn local measurements into higher-level procedural decisions."
  },
  {
    category:"VEX", title:"Use primintrinsic() when the value already exists on the primitive",
    text:"Before calculating geometry yourself, check whether Houdini already exposes the value as a primitive intrinsic.",
    code:'float area = primintrinsic(0, "measuredarea", @primnum);',
    why:"Intrinsics are often faster and cleaner than rebuilding measurements manually."
  },
  {
    category:"SOPs", title:"Pack early when iterating on many pieces",
    text:"If a workflow repeatedly transforms or copies many independent pieces, packing them can dramatically reduce geometry overhead.",
    why:"Packed primitives are one of Houdini's key performance tools for large procedural scenes."
  },
  {
    category:"VEX", title:"Use clamp() at tool boundaries",
    text:"When exposing normalized controls such as 0-1 sliders, clamp the value before using it in geometry logic.",
    code:'float u = clamp(chf("position"), 0.0, 1.0);',
    why:"It makes procedural tools much more robust when values come from animation, expressions, or external data."
  },
  {
    category:"SOPs", title:"Group Expand can turn selections into falloffs",
    text:"Group Expand can grow or shrink a selection by adjacency and can create a useful procedural transition around a hard selection.",
    why:"It is a handy alternative to rebuilding neighbourhood logic in VEX."
  }
];

const usedKey = "houdini_qt_used_v1";
let used = new Set(JSON.parse(localStorage.getItem(usedKey) || "[]"));

function nextTip(){
  if(used.size >= tips.length) used.clear();
  const available = tips.map((_,i)=>i).filter(i=>!used.has(i));
  const index = available[Math.floor(Math.random()*available.length)];
  used.add(index);
  localStorage.setItem(usedKey, JSON.stringify([...used]));
  showTip(tips[index]);
}

function showTip(t){
  category.textContent=t.category;
  tipTitle.textContent=t.title;
  tipText.textContent=t.text;
  why.textContent=t.why ? "Why it matters: " + t.why : "";
  if(t.code){
    code.hidden=false;
    code.textContent=t.code;
  }else{
    code.hidden=true;
    code.textContent="";
  }
  status.textContent="";
}

async function copyCurrent(){
  const text = `${tipTitle.textContent}\n\n${tipText.textContent}${code.hidden?"":"\n\n"+code.textContent}\n\n${why.textContent}`;
  try{
    await navigator.clipboard.writeText(text);
    status.textContent="Copied.";
  }catch{
    status.textContent="Copy isn't available in this browser.";
  }
}

newTip.addEventListener("click", nextTip);
copyTip.addEventListener("click", copyCurrent);

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js").catch(()=>{});
}
