
const App = (function(){
  const defaultProducts = [
  { id: 'paint-01', title: 'Premium Exterior Paint - 5L', price: 9000, short: 'Long-lasting protective paint', image: 'chair/paint.jpg', description: 'Eco-friendly, UV-resistant paint for exterior surfaces.' },
  { id: 'paint-02', title: 'Interior Paint - 5L', price: 8500, short: 'Smooth finish interior paint', image: 'chair/nail.jpg', description: 'High-quality paint for indoor walls.' },
  { id: 'zinc-01', title: 'Zinc Roofing Sheet - 1.2mm', price: 12000, short: 'Weather-proof zinc sheets', image: 'chair/zinc.jpg', description: 'Premium zinc sheets for roofing and cladding. Durable and corrosion resistant.' },
  { id: 'rod-01', title: 'Iron Rod 10mm', price: 2500, short: 'Rebar for construction', image: 'chair/iron.jpg', description: 'High-strength iron rods suitable for foundations, pillars, and beams.' },
  { id: 'nail-01', title: 'Box of Nails (1kg)', price: 800, short: 'Quality nails', image: 'chair/wood.jpg', description: 'High-quality nails for framing and finishing.' },
  { id: 'cement-01', title: 'Premium Cement 50kg', price: 15000, short: 'High-strength cement', image: 'chair/z.jpg', description: 'Durable cement for construction projects.' },
];


  const CART_KEY = 'afeo_cart_v1';
  const PROJECTS_KEY = 'afeo_projects_v1';

  function getCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } 
    catch(e){ return []; }
  }
  function setCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('storage')); 
  }

  function updateCartCountUI(){
    const count = getCart().reduce((sum,i)=>sum+i.qty,0);
    document.querySelectorAll('#cart-count').forEach(el=>el.innerText=count);
  }


  function getProjects(){
    try { return JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]'); } 
    catch(e){ return []; }
  }
  function setProjects(list){
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
  }


  function findProduct(id){
    return getProducts().find(p=>p.id===id);
  }

  function getProducts(){
    const projects = getProjects();
    const projectProducts = projects.map(p => ({
      id: `proj-${p.created}`, 
      title: p.title,
      price: p.price || 0, 
      short: p.desc || '',
      image: (p.images && p.images[0]) || 'images/default.png',
      description: p.desc || ''
    }));
    return [...defaultProducts, ...projectProducts];
  }

  function formatCurrency(n){
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(n);
  }

  function addToCart(id, qty=1){
    const product = findProduct(id);
    if(!product) return;
    const cart = getCart();
    const existing = cart.find(i=>i.id===id);
    if(existing) existing.qty += qty;
    else cart.push({ id, qty });
    setCart(cart);
    updateCartCountUI();
    if(typeof window.renderCart==='function') window.renderCart();
  }

  function changeQty(id, delta){
    const cart = getCart();
    const item = cart.find(i=>i.id===id);
    if(!item) return;
    item.qty += delta;
    if(item.qty<=0){
      const idx = cart.findIndex(i=>i.id===id);
      if(idx!==-1) cart.splice(idx,1);
    }
    setCart(cart);
    updateCartCountUI();
    if(typeof window.renderCart==='function') window.renderCart();
  }

  function removeFromCart(id){
    const cart = getCart().filter(i=>i.id!==id);
    setCart(cart);
    updateCartCountUI();
    if(typeof window.renderCart==='function') window.renderCart();
  }

  function clearCart(){
    setCart([]);
    updateCartCountUI();
    if(typeof window.renderCart==='function') window.renderCart();
  }

  function getCartTotal(){
    return getCart().reduce((sum,item)=>{
      const p = findProduct(item.id);
      return sum + (p ? p.price*item.qty : 0);
    },0);
  }


  function saveProject(obj){
    const list = getProjects();
    list.push(obj);
    setProjects(list);
  }


  function fileToBase64(file){
    return new Promise((res,rej)=>{
      const reader = new FileReader();
      reader.onload = ()=>res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }


  return {
    init: updateCartCountUI,
    getProducts,
    getProductById: findProduct,
    formatCurrency,


    getCart,
    addToCart,
    changeQty,
    removeFromCart,
    clearCart,
    getCartTotal,

 
    getProjects,
    saveProject,

 
    fileToBase64
  };

})();

window.App = App;
