//   ____      _     ____        _        
//  / ___| ___| |_  |  _ \  __ _| |_ __ _ 
// | |  _ / _ \ __| | | | |/ _` | __/ _` |
// | |_| |  __/ |_  | |_| | (_| | || (_| |
//  \____|\___|\__| |____/ \__,_|\__\__,_|
//
// By BLxcwg666 <huixcwg@gmail.com>

// 获取表格主体
const tableBody = document.getElementById('tableBody');
// Func：显示错误信息
function displayError(message) {
  // 清空表格主体
  tableBody.innerHTML = '';
  // 创建一行，显示错误信息
  const errorRow = document.createElement('tr');
  errorRow.innerHTML = `<td colspan="5" class="p-4 align-middle font-medium text-red-500">${message}</td>`;
  
  // 将行追加到表格主体中
  tableBody.appendChild(errorRow);
}

function displayLoading() {
  // 清空表格主体
  tableBody.innerHTML = '';
  // 创建一行，显示加载中
  const loadingRow = document.createElement('tr');
  loadingRow.innerHTML = `<td colspan="5" class="p-4 align-middle font-medium text-blue-500">坐和放宽，好东西就要来了...</td>`;
  
  // 将行追加到表格主体中
  tableBody.appendChild(loadingRow);
}

displayLoading();
// 获取数据
fetch('https://api.travellings.cn/all')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const originalData = data.data; // 保存原始数据
    // Func：根据关键字过滤数据
    function filterData(keyword) {
      return originalData.filter(item =>
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.id.toString().includes(keyword) ||
        item.url.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    // Func：渲染数据
    function renderData(dataToRender) {
      // 清空表格主体
      tableBody.innerHTML = '';
      // 遍历数据并动态创建表格行
      dataToRender.forEach(item => {
        const row = document.createElement('tr');
        // 创建表格单元格并用数据填充
        const idCell = document.createElement('td');
        idCell.className = 'p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium';
        idCell.textContent = item.id;
        const nameCell = document.createElement('td');
        nameCell.className = 'p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium';
        nameCell.textContent = item.name;
        const urlCell = document.createElement('td');
        urlCell.className = 'p-4 align-middle [&amp;:has([role=checkbox])]:pr-0';
        const urlLink = document.createElement('a');
        urlLink.href = item.url;
        urlLink.textContent = item.url;
        urlCell.appendChild(urlLink);
        const statusCell = document.createElement('td');
        statusCell.className = 'p-4 align-middle [&amp;:has([role=checkbox])]:pr-0';
        statusCell.textContent = item.status;
        const tagCell = document.createElement('td');
        tagCell.className = 'p-4 align-middle [&amp;:has([role=checkbox])]:pr-0';
        tagCell.textContent = item.tag;
        // 将单元格追加到行中
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(urlCell);
        row.appendChild(statusCell);
        row.appendChild(tagCell);
        // 将行追加到表格主体中
        tableBody.appendChild(row);
      });
    }
    // 获取输入框
    const searchInput = document.querySelector('.border');
    // 监听输入事件
    searchInput.addEventListener('input', () => {
      const keyword = searchInput.value.trim();
      const filteredData = filterData(keyword);
      renderData(filteredData);
    });
    // 初始渲染所有数据
    renderData(originalData);
  })
  .catch(error => {
    // console.error('获取数据时出错：', error);
    displayError(`发生错误，请刷新页面重试。<br>${error}`);
  });