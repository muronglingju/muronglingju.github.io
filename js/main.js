// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // ========== 1. LeanCloud 初始化（替换为你的应用凭证） ==========
  AV.init({
    appId: 'pt4WRIOfrDaavXW50WAWmtHB-gzGzoHsz',
    appKey: '4lGxCboAGCFDM1Uq54SRNApk',
    serverURLs: 'https://pt4wriof.lc-cn-n1-shared.com' // 如 https://xxx.api.lncldglobal.com
  });

  // ========== 2. 全局变量定义 ==========
  const categoryItems = document.querySelectorAll('.category-item'); // 分类标签
  const loading = document.getElementById('loading'); // 加载提示
  const articleList = document.getElementById('List'); // 文章列表容器
  const empty = document.getElementById('empty'); // 空数据提示
  let activeCategory = 'System Development'; // 默认选中分类

  // ========== 3. 初始化加载文章 ==========
  loadArticleData(activeCategory);

  // ========== 4. 分类切换事件 ==========
  categoryItems.forEach(item => {
    item.addEventListener('click', function() {
      // 切换选中样式
      categoryItems.forEach(li => li.classList.remove('active'));
      this.classList.add('active');
      // 获取当前分类并重新加载数据
      activeCategory = this.dataset.category;
      loadArticleData(activeCategory);
    });
  });

  // ========== 5. 核心方法：加载文章数据 ==========
  function loadArticleData(category) {
    // 显示加载中，隐藏其他元素
    loading.style.display = 'block';
    articleList.innerHTML = '';
    empty.style.display = 'none';

    // 构建 LeanDB 查询条件
    const query = new AV.Query('Article');
    query.equalTo('category', category); // 按分类筛选
    query.descending('createTime'); // 按发布时间倒序

    // 执行查询
    query.find().then(res => {
      loading.style.display = 'none'; // 隐藏加载提示
      // 无数据处理
      if (res.length === 0) {
        empty.style.display = 'block';
        return;
      }
      // 渲染文章列表
      let html = '';
      res.forEach(item => {
        const article = {
          title: item.get('title'),
          link: item.get('link'),
          coverImage: item.get('coverImage') || ''
        };
        html += `
          <div class="article-item" onclick="window.location.href='${article.link}'">
            ${article.coverImage ? `<img class="article-cover" src="${article.coverImage}" alt="${article.title}">` : ''}
            <div class="article-title">${article.title}</div>
          </div>
        `;
      });
      articleList.innerHTML = html;
    }).catch(err => {
      // 加载失败处理
      loading.style.display = 'none';
      empty.textContent = '数据加载失败，请刷新重试';
      empty.style.display = 'block';
      console.error('LeanDB 查询失败：', err);
    });
  }
});
