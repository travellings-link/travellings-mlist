<div class="modal fade" id="sync">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content main">

        <div class="modal-header">
          <h4 class="modal-title">一键添加</h4>
          <button type="button" class="close" data-dismiss="modal">×</button>
        </div>

        <div class="modal-body">
            <div class="alert alert-primary" style="display: none;" id="infoSync"></div>
            <div>以下为包含 “审核通过” Tag 的 <strong>OPEN</strong> Issues，添加成功后这些 Issues 将会被自动关闭</div>
            <table class="table mt-3">
                <thead>
                    <th>ID</th>
                    <th>网站名称</th>
                    <th>网站链接</th>
                </thead>
                <tbody id="websites">
                    <tr>
                        <td><span class="spinner-border"></span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    
        <div class="modal-footer">
            <button class="btn btn-success" id="addAll">
                <span class="spinner-border spinner-border-sm" style="display: none;" id="addSpinner"></span>
                一键添加
            </button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
        </div>
      </div>
    </div>
</div>