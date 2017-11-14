(function () {
    function renderDisplayFormLink(renderCtx) {
        var item = renderCtx.CurrentItem;
        var displayFormUrl = renderCtx.displayFormUrl + '&ID=' + item.ID;
        return '<a href="' + displayFormUrl + '">' + item.ObjetCourrier + '</a>'; 
        return String.format('<a href="{0}" class="ms-listlink" onfocus="OnLink(this)" onclick="DisplayItem(event, \'{0}\');return false;">{1}</a>', displayFormUrl, item.ObjetCourrier)
    }

    function postRender(ctx){
        var rows = ctx.ListData.Row;
        for (var i=0;i<rows.length;i++)
        {
            if((i%2)==0)
            {
                var rowElementId = GenerateIIDForListItem(ctx, rows[i]);
                var tr = document.getElementById(rowElementId);
                tr.style.backgroundColor = "#f3f3f3";
            }
        }
    }

    function overrideTemplate()
    {
        var ctxView = {};
        ctxView.Templates = {};
        ctxView.Templates.Fields = {
            'ObjetCourrier' : { 'View': renderDisplayFormLink }
        };
        ctxView.OnPostRender = postRender;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(ctxView);
    } 
    ExecuteOrDelayUntilScriptLoaded(overrideTemplate, 'clienttemplates.js');
})();

 
    
