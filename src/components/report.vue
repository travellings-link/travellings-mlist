<template>
      <div class="modal fade" id="report">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content main">

            <div class="modal-header">
              <h4 class="modal-title">举报网站 <span class="badge badge-secondary">ID: <span id="siteIDReport">0</span></span></h4>
              <button type="button" class="close" data-dismiss="modal">×</button>
            </div>

            <div class="modal-body">
                <div class="alert alert-primary" style="display: none;" id="infoReport"></div>
                <div>
                    如果您发现此网站不再符合开往的<a
                        href="https://www.travellings.cn/docs/join">审核标准</a>，可以在此举报，我们会尽快处理。
                </div>
                <div class="mt-3">
                    <label for="reasonSel">举报类型:</label>
                    <select id="reasonSel" class="form-control mb-3">
                        <optgroup label="内容违规">
                            <option>该网站现在存在违法违规内容</option>
                        </optgroup>
                        <optgroup label="开往链接违规">
                            <option>该网站的巡查状态非LOST，但是未找到开往链接/徽标</option>
                            <option>该网站的开往链接放置在PC端默认收起的菜单中，难以发现</option>
                            <option>该网站的PC端有开往链接，但移动端未找到</option>
                        </optgroup>
                        <optgroup label="服务器/域名问题">
                            <option>该网站的巡查状态为RUN，但是无法正常访问</option>
                        </optgroup>
                        <optgroup label="其他">
                            <option>其他</option>
                        </optgroup>
                    </select>
                    <label for="reason">备注说明:</label>
                    <textarea class="form-control mb-3" id="reason" placeholder="请输入其他举报理由" rows="5"></textarea>
                    <label for="contact">联系方式:</label>
                    <input type="email" class="form-control mb-3" id="contact" placeholder="请输入您的邮箱，以便后续联系">
                    <div id="check"></div>
                </div>
            </div>
        
            <div class="modal-footer">
                <button class="btn btn-success" id="reportBtn">
                    <span class="spinner-border spinner-border-sm" style="display: none;" id="reportSpinner"></span>
                    提交
                </button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            </div>
          </div>
        </div>
    </div>
</template>
