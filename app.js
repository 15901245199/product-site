// 模拟你的服装仓库商品数据（在此处自由添加或修改你的商品）
const products = [
  {
    id: 1,
    sku: "CF8878",
    name: "锦纶防蚊薄荷黑科技透气防晒衣男女款",
    category: "外套/冲锋衣",
    weight: "180g",
    fabric: "锦纶防晒黑科技面料",
    craft: "适合刺绣 / 烫画",
    sizes: "M / L / XL / 2XL / 3XL",
    colors: ["薄荷绿", "纯洁白", "高级灰", "酷炫黑"],
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 2,
    sku: "CQD-7904",
    name: "320g华棉重磅落肩款圆领套头卫衣",
    category: "卫衣",
    weight: "320g",
    fabric: "320g 华棉精梳重磅棉",
    craft: "适合丝网印 / 胶印 / 刺绣",
    sizes: "S / M / L / XL / 2XL / 3XL / 4XL",
    colors: ["燕麦色", "黑色", "麻灰", "藏青"],
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: 3,
    sku: "CF677",
    name: "140g冰丝仿棉弹力抗皱翻领短袖POLO衫",
    category: "POLO衫",
    weight: "180g",
    fabric: "冰丝仿棉高弹透气面料",
    craft: "适合胸口刺绣 / 热转印",
    sizes: "M / L / XL / 2XL / 3XL",
    colors: ["藏青拼白", "纯白", "黑色"],
    image: "https://images.unsplash.com/photo-1625910513413-5fc28340a830?auto=format&fit=crop&w=600&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1625910513413-5fc28340a830?auto=format&fit=crop&w=600&q=80"
    ]
  }
];

let currentCategory = "all";
let currentWeight = "all";
let searchKeyword = "";
let selectedProduct = null;

// 渲染商品网格
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const filtered = products.filter(p => {
    const matchCat = currentCategory === "all" || p.category === currentCategory;
    const matchWeight = currentWeight === "all" || p.weight === currentWeight;
    const matchSearch = p.sku.toLowerCase().includes(searchKeyword) || 
                        p.name.toLowerCase().includes(searchKeyword) ||
                        p.fabric.toLowerCase().includes(searchKeyword);
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
      <img src="${p.image}" alt="${p.name}">
      <div class="card-info">
        <div class="card-sku">${p.sku}</div>
        <div class="card-title">${p.name}</div>
        <div class="card-tags">
          <span class="card-tag">${p.weight}</span>
          <span class="card-tag">${p.category}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// 打开弹窗并渲染详情
function openModal(p) {
  selectedProduct = p;
  document.getElementById("modalSku").innerText = `款号：${p.sku}`;
  document.getElementById("modalTitle").innerText = p.name;
  document.getElementById("modalFabric").innerText = p.fabric;
  document.getElementById("modalWeight").innerText = p.weight;
  document.getElementById("modalCraft").innerText = p.craft;
  document.getElementById("modalSizes").innerText = p.sizes;
  document.getElementById("modalMainImg").src = p.image;

  // 渲染色块
  const colorContainer = document.getElementById("modalColors");
  colorContainer.innerHTML = p.colors.map(c => `<span class="color-tag">${c}</span>`).join("");

  // 渲染缩略图
  const thumbContainer = document.getElementById("modalThumbList");
  thumbContainer.innerHTML = p.thumbs.map(t => `<img src="${t}" onclick="document.getElementById('modalMainImg').src='${t}'">`).join("");

  document.getElementById("productModal").style.display = "flex";
}

// 绑定事件
document.getElementById("closeModal").onclick = () => {
  document.getElementById("productModal").style.display = "none";
};

// 复制资料功能
document.getElementById("copyBtn").onclick = () => {
  if (!selectedProduct) return;
  const text = `【服装款号】${selectedProduct.sku}\n【品名】${selectedProduct.name}\n【面料】${selectedProduct.fabric}\n【克重】${selectedProduct.weight}\n【尺码】${selectedProduct.sizes}\n【颜色】${selectedProduct.colors.join(" / ")}`;
  navigator.clipboard.writeText(text).then(() => {
    alert("商品款号及详细参数已复制到剪贴板！可以发送给客户了。");
  });
};

document.getElementById("contactBtn").onclick = () => {
  alert("联系仓库客服：\n微信/电话：138-0000-0000\n（在 app.js 中可更改为你的真实电话）");
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

// 初始化渲染
renderProducts();
