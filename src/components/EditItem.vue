<template>
    <div class="modal fade" id="editItem">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content main">

                <div class="modal-header">
                    <h4 class="modal-title">编辑网站 <span class="badge badge-secondary">ID: <span
                                id="siteID">0</span></span></h4>
                    <button type="button" class="close" data-dismiss="modal">×</button>
                </div>

                <div class="modal-body">
                    <div class="alert alert-primary" style="display: none;" id="info"></div>
                    <div class="mt-3">
                        <label for="websiteName">网站名称:</label>
                        <input type="text" class="form-control mb-3" id="websiteName" placeholder="请输入网站名称">
                        <label for="websiteLink">网站链接:</label>
                        <input type="url" class="form-control mb-3" id="websiteLink" placeholder="请输入网站链接">
                        <div class="row">
                            <div class="col-6">
                                <label for="status">网站状态:</label>
                                <select class="form-control mb-3" id="status">
                                    <option value="RUN">正常 (RUN)</option>
                                    <option value="LOST">网址存活，但无开往徽标 (LOST)</option>
                                    <option value="ERROR">网址异常 (ERROR)</option>
                                    <option value="TIMEOUT">连接超时 (TIMEOUT)</option>
                                    <option value="WAIT">等待处理 (WAIT)</option>
                                    <option value="400">400 Bad Request</option>
                                    <option value="403">403 Forbidden</option>
                                    <option value="404">404 Not Found</option>
                                    <option value="405">405 Method Not Allowed</option>
                                    <option value="418">418 I'm a teapot</option>
                                    <option value="429">429 Too Many Requests</option>
                                    <option value="500">500 Internal Server Error</option>
                                    <option value="501">501 Not Implemented</option>
                                    <option value="502">502 Bad Gateway</option>
                                    <option value="503">503 Service Unavailable</option>
                                    <option value="504">504 Gateway Timeout</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label for="tag">TAG:</label>
                                <input type="text" class="form-control mb-3" id="tag" placeholder="请输入TAG" value="go">
                            </div>
                        </div>
                        <div id="tagSel"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="submitBtnEdit" class="btn btn-primary"><span class="spinner-border spinner-border-sm"
                            style="display: none;" id="spinner"></span>
                        更新</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>

</template>