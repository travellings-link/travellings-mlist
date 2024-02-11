// list.js
// by xuanzhi33

let listData = null;
let userRole = "访客";
let statusFilter = "ALL";
let tagFilter = "go";
let curPage = 1;
let curData = null;
let pageNum = 0;

const pageSize = 20;

let filterCurPage = data => {
    updatePageNav(data.length);
    let start = (curPage - 1) * pageSize;
    let end = start + pageSize;
    return data.slice(start, end);
}

let updatePageNav = total => {
    let pageBtn = (i) => {
        if (i == 0) {
            return `<button class="btn btn-light" disabled>...</button>`;
        } else if (curPage == i) {
            return `<button class="btn btn-primary">${i}</button>`;
        } else {
            return `<button class="btn btn-light" onclick="gotoPage(${i})">${i}</button>`;
        }
    }

    pageNum = Math.ceil(total / pageSize);
    let pageNav = $('.page-nav');

    if (pageNum <= 1) {
        pageNav.html(''); // 清空
        return;
    }

    let html = `<div class="btn-group">`;

    html += pageBtn(1); // 首页

    let startPage = Math.max(2, curPage - 2);
    let endPage = Math.min(pageNum - 1, curPage + 2);

    if (startPage > 2) html += pageBtn(0);

    for (let i = startPage; i <= endPage; i++) {
        html += pageBtn(i);
    }

    if (endPage < pageNum - 1) html += pageBtn(0);
    
    html += pageBtn(pageNum); // 尾页

    html += `</div><br>
    <div class="btn-group mt-1">`;
    // 上一页
    html += `<button class="btn btn-light" onclick="gotoPage(${curPage - 1})">
        <i class="fa fa-chevron-left"></i> 上一页
        </button>`;
    // 跳转按钮
    html += `<button class="btn btn-light" onclick="jumpTo()">${curPage} / ${pageNum}</button>`;
    
    // 下一页
    html += `<button class="btn btn-light" onclick="gotoPage(${curPage + 1})">
        下一页 <i class="fa fa-chevron-right"></i>
        </button>`;
    html += `</div>`;
    pageNav.html(html);
}

let jsonPost = (url, data) => {
    return $.ajax({
        url,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json"
    });
}

let renderTable = (data, backToFirstPage = true) => {
    curData = data;
    if (backToFirstPage) curPage = 1;
    displayTable();
}

let gotoPage = p => {
    if (p < 1) return;
    if (p > pageNum) return;
    curPage = p;
    displayTable();
}

let jumpTo = () => {
    let total = pageNum;
    let p = prompt(`请输入要跳转的页码 (1-${total})`);
    let pageInt = parseInt(p);
    if (isNaN(pageInt)) return;
    gotoPage(pageInt);
}

let displayTable = () => {
    let data = curData;

    if (statusFilter != "ALL") { // 启用过滤器
        if (statusFilter == "OTHER") { // 非 RUN
            data = data.filter(item => item.status != "RUN");
        } else if (statusFilter == "4XX") { // begin with 4
            data = data.filter(item => item.status.startsWith("4"));
        } else if (statusFilter == "5XX") { // begin with 5
            data = data.filter(item => item.status.startsWith("5"));
        } else { // 其他
            data = data.filter(item => item.status == statusFilter);
        }
    }

    if (tagFilter != "go") { // 启用过滤器
        data = data.filter(item => item.tag.includes(tagFilter));
    }

    data = filterCurPage(data);

    let html = '';
    for (let i = 0; i < data.length; i++) {
        let displayUrl = data[i].url.replace("https://", "");
        let idColor = "";
        let statusIcon = "";
        let status = data[i].status;
        if (status == "LOST") {
            idColor = "warning";
            statusIcon = `exclamation-triangle`;
        } else if (status == "WAIT") {
            idColor = "info";
            statusIcon = `clock-o`;
        } else if (status == "RUN") {
            idColor = "success";
            statusIcon = `check-circle`;
        } else {
            idColor = "danger";
            statusIcon = `times-circle`;
        }

        let failedReason = data[i].failedReason;
        let failedReasonHTML = "";
        if (failedReason) {
            failedReasonHTML = ` data-toggle="tooltip" title="${failedReason}"`;
        }

        let statusHTML = ` <i class="fa fa-${statusIcon} text-${idColor}"${failedReasonHTML}></i>`;

        let tags = data[i].tag.split(",");
        let tagHTML = "";
        const tagColor = {
            "blog": "success",
            "normal": "secondary",
            "coder": "info",
            "site": "warning",
            "life": "primary",
            "hybrid": "danger"
        }
        for (let j = 0; j < tags.length; j++) {
            if (tags[j] == "go") continue;
            let thisColor = tagColor[tags[j]] || "secondary";
            tagHTML += `<span class="badge badge-${thisColor}">${tags[j]}</span> `;
        }

        html += `
            <tr>
                <td data-toggle="tooltip" title="${status}">${data[i].id}</td>
                <td>${data[i].name}${statusHTML}</td>
                <td><a href="${data[i].url}" target="_blank">${displayUrl}</a></td>
                <td><a href="https://list.travellings.cn/report.html?id=${data[i].id}" target="_blank"><button type="button" class="btn btn-info">举报网站</button></a></td>
                <td class="pcOnly"><span${failedReasonHTML}>${data[i].status}</span></td>
                <td class="pcOnly">${tagHTML}</td>
                <td class="adminOnly">
                    <a href="javascript:;" onclick="editItem(${data[i].id})" data-toggle="tooltip" title="编辑"><i class="fa fa-edit"></i></a>
                    <a href="javascript:;" onclick="del(${data[i].id})" data-toggle="tooltip" title="删除"><i class="fa fa-trash"></i></a>
                </td>
            </tr>
        `;
    }

    if (data.length == 0) {
        html = `
            <tr>
                <td colspan="6" class="text-center">
                    <i class="fa fa-minus-circle"></i>
                    暂无数据
                </td>
            </tr>
        `;
    }

    $('#mlist').html(html);

    $('[data-toggle="tooltip"]').tooltip();

    if (userRole == "管理员") {
        $(".adminOnly").show();
    }
}

let search = () => {
    let kw = $('#searchInp').val().toLowerCase();
    if (kw == '') {
        renderTable(listData);
        return;
    }

    if (kw == "tlogin") {
        if (!confirm("是否前往登录页面？")) return;
        location.href = "./user/";
        return;
    }

    let dataFiltered = listData.filter(item => {
        let itemName = item.name.toLowerCase();
        let itemUrl = item.url.toLowerCase();
        let itemId = item.id;
        return itemName.includes(kw) || itemUrl.includes(kw) || itemId == kw;
    });
    
    renderTable(dataFiltered);
}

$('#searchInp').on('input', search);


let initTable = async (backToFirstPage = true) => {
    let dataRaw = await $.getJSON("https://api.travellings.cn/all");
    listData = dataRaw.data;
    renderTable(listData, backToFirstPage);
}



let del = async (id) => {
    if (!confirm('确定要删除id为' + id + '的网站吗？')) {
        return;
    }
    let res = null;
    try {
        res = await jsonPost(`https://api.travellings.cn/action/del`, { id });
    } catch (error) {
        alert(error.responseJSON.msg);
        return;
    }
   
    if (res.success) {
        alert(res.msg);
        initTable();
    } else {
        alert(res.msg);
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}


let checkUser = async () => {
    let token = getCookie("_tlogin")
    if (!token) return; // 如果没有登录态，就不用check了

    let res = await $.getJSON(`https://api.travellings.cn/user`);
    console.log(res);
    let data = res.data;

    let username = data.user;

    if (data.role == 0) { // 管理员
        $(".adminOnly").fadeIn();
        userRole = "管理员";
    } else if (data.role == 1) { // 普通用户
        $(".guestUserOnly").fadeIn();
    } else { // 登录失效
        localStorage.removeItem("tlogin");
        alert("您的登录态已失效，请重新登录");
        location.reload();
    }

    $(".username").text(username);          
}


let init = async () => {
    await initTable();
    await checkUser();
}

init();

let logout = async () => {
    if (!confirm("确定要退出登录吗？")) return;

    let res = await $.getJSON(`https://api.travellings.cn/logout`);
    alert(res.msg);
    
    location.reload();
}

$("#statusFilter").on("change", function() {
    statusFilter = $(this).val();
    renderTable(listData);
});

$("#tagFilter").on("change", function() {
    tagFilter = $(this).val();
    renderTable(listData);
});

$("#refreshBtn").on("click", async function() {
    $(this).attr("disabled", true);
    $("#refreshSpinner").show();
    await initTable();
    $(this).attr("disabled", false);
    $("#refreshSpinner").hide();
});

// Edit
let showInfo = msg => {
    $('#info').text(msg).slideDown();
    setTimeout(() => {
        $('#info').slideUp();
    }, 3000);
}

let showSpinnerEdit = () => {
    $("#submitBtnEdit").attr("disabled", true);
    $("#spinner").show();
}

let hideSpinnerEdit = () => {
    $("#submitBtnEdit").attr("disabled", false);
    $("#spinner").hide();
}

let getOriginalData = async id => {
    let websiteId = id;
    let res = null;
    try {
        res = await $.getJSON(`https://api.travellings.cn/action/${websiteId}`);
    } catch (error) {
        showInfo(error.responseJSON.msg);
        return;
    }

    if (!res.success) {
        showInfo(res.msg);
        return;
    }

    let { name, link, status, tag } = res.data;
    $('#websiteName').val(name);
    $('#websiteLink').val(link);
    $('#tag').val(tag);
    $('#status').val(status);
}

let update = async () => {
    let id = $('#siteID').text();
    let name = $('#websiteName').val();
    let link = $('#websiteLink').val();
    let tag = $('#tag').val();
    let status = $('#status').val();

    showSpinnerEdit();

    // 发送更新请求
    try {
        let res = await jsonPost(`https://api.travellings.cn/action/edit`, {id, name, link, tag, status });
        if (res.success) {
            $('#editItem').modal('hide');
            initTable(false);
        } else {
            showInfo(res.msg);
        }
    } catch (error) {
        showInfo(error.responseJSON.msg);
    }

    hideSpinnerEdit();
}

$("#submitBtnEdit").click(update);

let editItem = async id => {
    $('#siteID').text(id);
    await getOriginalData(id);
    $('#editItem').modal('show');
}

// sync

let showInfoSync = msg => {
    $('#infoSync').text(msg).slideDown();
    setTimeout(() => {
        $('#infoSync').slideUp();
    }, 3000);
}


let websites = null;
let addWebsite = async index => {
    let thisBtn = $(".addBtn").eq(index);
    thisBtn.attr("disabled", true);
    thisBtn.text("添加中...");

    let website = websites[index];

    let res = null;
    try {
        res = await jsonPost(`https://api.travellings.cn/action/add`, [website]);
    } catch (error) {
        showInfo(error.responseJSON.msg);
        return;
    }
    
    showInfo(res.msg);
    thisBtn.fadeOut();
}

let getIssues = async () => {
    let timestamp = new Date().getTime();

    let res = await $.getJSON("https://api.github.com/repos/travellings-link/travellings/issues?labels=审核通过&_t=" + timestamp);
    let html = "";
    websites = [];
    for (let i = 0; i < res.length; i++) {
        let body = res[i].body;
        let websiteData = body.split("\n");
        let websiteName = websiteData[2];
        let websiteLink = websiteData[6];
        let issuesID = res[i].number;
        let issuesLink = res[i].html_url;
        websites.push({
            name: websiteName,
            link: websiteLink,
            status: "RUN",
            tag: "go"
        });

        html += `<tr>
                    <td><a href="${issuesLink}" target="_blank">#${issuesID}</a></td>
                    <td>${websiteName}</td>
                    <td><a href="${websiteLink}" target="_blank">${websiteLink}</a></td>
                    <td><button class="btn btn-success btn-sm addBtn" onclick="addWebsite(${i})">添加</button></td>
                </tr>`;
    }
    $("#websites").html(html);

    $("#refreshIssuesBtn").attr("disabled", false);
    $("#refreshIssuesSpinner").hide();
}

getIssues();

$("#addAll").click(async () => {
    $("#addAll").attr("disabled", true);
    $("#addSpinner").show();
    
    $(".addBtn").attr("disabled", true);
    $(".addBtn").text("添加中...");

    let res = null;
    try {
        res = await jsonPost(`https://api.travellings.cn/action/add`, websites);
    } catch (error) {
        showInfo(error.responseJSON.msg);
        return;
    }
    
    if (res.success) {
        curPage = pageNum;
        await initTable(false);
        $("#sync").modal("hide");
    } else {  
        showInfo(res.msg);
    }
    $("#addAll").attr("disabled", false);
    $("#addSpinner").hide();
    $(".addBtn").fadeOut();
});

$("#refreshIssuesBtn").click(async () => {
    $("#refreshIssuesBtn").attr("disabled", true);
    $("#refreshIssuesSpinner").show();
    await getIssues();
});