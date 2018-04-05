/**
 * Ce script CSR (Client Side Rendering) permet d'améliorer l'affichage de la vue des courriers
 * L'objet du courrier sera transformé en lien cliquable. Au clic, on ouvre la page d'affichage du courrier (DispForm.aspx)
 */
(function () {
    /**
     * Renvoie le lien de la page d'affichage (DispForm.aspx) du courrier
     * @param {*} renderCtx Contexte de la vue
     */
    function renderDisplayFormLink(renderCtx) {
        var item = renderCtx.CurrentItem;
        var displayFormUrl = renderCtx.displayFormUrl + '&ID=' + item.ID+ "&Source=/courriers/Pages/Courriers-envoyes.aspx";
        return '<a href="' + displayFormUrl + '">' + item.ObjetCourrier + '</a>';
                //+String.format("<a href='{0}' class='ms-listlink' onfocus='OnLink(this)' onclick='DisplayItem(event, {1});return false;'>{2}</a>", displayFormUrl,displayFormUrl, item.ObjetCourrier);
    }

    /** Personnalise la liste des courriers en affichage de couleur de fond alterné */
    function postRender(ctx){
        /** Nombre de lignes (Nombre de courriers) */
        var rows = ctx.ListData.Row;
        /** Pour alterner la couleur de fond sur les lignes de la liste de courriers */
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

    /** Efface l'affichage par défaut de la vue SharePoint et nous permet d'utiliser notre affichage */
    function overrideTemplate()
    {
        /** Contexte de la vue */
        var ctxView = {};
        /** Templates de la vue */
        ctxView.Templates = {};
        /** Champs du template */
        ctxView.Templates.Fields = {
            /** Pour le champ 'ObjetCourrier' nous personnalisons le rendu à l'aide de la fonction renderDisplayFormLink(), qui y ajoutera un lien */
            'ObjetCourrier' : { 'View': renderDisplayFormLink }
        };
        /** Après l'exécution du rendu personnalisé de la vue, on appelle la fonction postRender() */
        ctxView.OnPostRender = postRender;
        /** On signale à SharePoint de prendre en compte le rendu de notre vue 'ctxView' */
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(ctxView);
    } 
    ExecuteOrDelayUntilScriptLoaded(overrideTemplate, 'clienttemplates.js');
})();

 
    
