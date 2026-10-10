let products = [];
let currentCategory = "all";
let currentWeight = "all";
let searchKeyword = "";
let selectedProduct = null;

// 异步加载 products.json 数据
async function loadProducts() {
  try {
    const response = await fetch('products.json');
    products = await response.json();
    renderProducts();
  } catch (error) {
    console.error("加载商品数据失败:", error);
    document.getElementById("productGrid").innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #red;">加载商品数据失败，请检查 products.json 格式</div>`;
  }
}

// 渲染商品网格
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const filtered = products.filter(p => {
    const matchCat = currentCategory === "all" || p.category === currentCategory;
    const matchWeight = currentWeight === "all" || p.weight === currentWeight;
    const matchSearch = (p.sku && p.sku.toLowerCase().includes(searchKeyword)) || 
                        (p.name && p.name.toLowerCase().includes(searchKeyword)) ||
                        (p.fabric && p.fabric.toLowerCase().includes(searchKeyword));
    return matchCat && matchWeight && matchSearch;
  });

  document.getElementById("productCount").innerText = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">没有匹配到相关款号商品</div>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.onclick = () => openModal(p);
    card.innerHTML = `
      <img src="${p.image || ''}" alt="${p.name || ''}">
      <div class="card-info">
        <div class="card-sku">${p.sku || ''}</div>
        <div class="card-title">${p.name || ''}</div>
        <div class="card-tags">
          <span class="card-tag">${p.weight || ''}</span>
          <span class="card-tag">${p.category || ''}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// 打开弹窗并渲染详情
function openModal(p) {
  selectedProduct = p;
  document.getElementById("modalSku").innerText = `款号：${p.sku || ''}`;
  document.getElementById("modalTitle").innerText = p.name || '';
  document.getElementById("modalFabric").innerText = p.fabric || '';
  document.getElementById("modalWeight").innerText = p.weight || '';
  document.getElementById("modalCraft").innerText = p.craft || '';
  document.getElementById("modalSizes").innerText = p.sizes || '';
  document.getElementById("modalMainImg").src = p.image || '';

  // 渲染色块
  const colorContainer = document.getElementById("modalColors");
  const colors = Array.isArray(p.colors) ? p.colors : [];
  colorContainer.innerHTML = colors.map(c => `<span class="color-tag">${typeof c === 'object' ? c.value || c : c}</span>`).join("");

  // 渲染缩略图
  const thumbContainer = document.getElementById("modalThumbList");
  const thumbs = Array.isArray(p.thumbs) && p.thumbs.length > 0 ? p.thumbs : [p.image];
  thumbContainer.innerHTML = thumbs.map(t => {
    const url = typeof t === 'object' ? t.url || t : t;
    return `<img src="${url}" onclick="document.getElementById('modalMainImg').src='${url}'">`;
  }).join("");

  document.getElementById("productModal").style.display = "flex";
}

// 绑定事件
document.getElementById("closeModal").onclick = () => {
  document.getElementById("productModal").style.display = "none";
};

// 复制资料功能
document.getElementById("copyBtn").onclick = () => {
  if (!selectedProduct) return;
  const colorsStr = Array.isArray(selectedProduct.colors) ? selectedProduct.colors.join(" / ") : "";
  const text = `【服装款号】${selectedProduct.sku}\n【品名】${selectedProduct.name}\n【面料】${selectedProduct.fabric}\n【克重】${selectedProduct.weight}\n【尺码】${selectedProduct.sizes}\n【颜色】${colorsStr}`;
  navigator.clipboard.writeText(text).then(() => {
    alert("商品款号及详细参数已复制到剪贴板！");
  });
};

document.getElementById("contactBtn").onclick = () => {
  alert("联系仓库客服：\n微信/电话：138-0000-0000");
};

// 分类筛选点击
document.querySelectorAll("#categoryFilter li").forEach(li => {
  li.onclick = (e) => {
    document.querySelectorAll("#categoryFilter li").forEach(el => el.classList.remove("active"));
    e.target.classList.add("active");
    currentCategory = e.target.dataset.cat;
    renderProducts();
  };
});

document.querySelectorAll("#weightFilter li").forEach(li => {
  li.onclick = (e) => {
    document.querySelectorAll("#weightFilter li").forEach(el => el.classList.remove("active"));
    e.target.classList.add("active");
    currentWeight = e.target.dataset.weight;
    renderProducts();
  };
});

// 搜索事件
document.getElementById("searchBtn").onclick = () => {
  searchKeyword = document.getElementById("searchInput").value.trim().toLowerCase();
  renderProducts();
};

document.getElementById("searchInput").oninput = (e) => {
  searchKeyword = e.target.value.trim().toLowerCase();
  renderProducts();
};

// 启动加载
loadProducts();
