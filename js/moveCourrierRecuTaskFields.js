/**
 * Organise le placement des champs des formulaires de tâche de courrier reçu dans le formulaire tacheCourrierRecu.form.html
 */
function moveCourrierRecuTaskFields(){
    $(".ibsn-field-value").each(function(){
        internalName = $(this).attr("data-internal-name");
        elem = $(this);
        elemLabel = elem.prev('h3');

        /** Parcourt les champs du formulaire par défaut présenté par SharePoint */
        $("table.ms-formtable td").each(function(){
            /** On déplace chaque champ par défaut vers son emplacement sur le template personnalisé */
            if(this.innerHTML.indexOf('FieldInternalName="'+internalName+'"') != -1 ){
                    $(this).prev().contents().appendTo(elemLabel);
                    $(this).contents().appendTo(elem);
            }
        });// Fin du each sur la table
    });// Fin du each parent

    /** Pour l'élément connexe : On le prévisualise */
    this.ctx = new SP.ClientContext.get_current();
    this.web = this.ctx.get_web();
        
    /** Récupération de l'ID de la liste Active et de l'ID de l'élément de liste actif */
    var listId = _spPageContextInfo.pageListId;
    var itemId = parseInt(GetUrlKeyValue('ID'));
    
    /** Récupération de la tâche (l'élément de liste) */
    this.list = this.web.get_lists().getById(listId);
    this.listItem = this.list.getItemById(itemId);

    this.ctx.load(this.listItem);
    this.ctx.executeQueryAsync(
        Function.createDelegate(this, function(sender, args){ // OnSuccess
            /** Tableau d'éléments connexes */
            var RelatedItems        = this.listItem.get_item('RelatedItems');
            /** Liste comportant l'élément connexe */
            var relatedItemListID   = RelatedItems[0].ListId;
            /** ID de l'élément connexe */
            var relatedItemID       = RelatedItems[0].ItemId;
            /** Elément connexe */
            displayRelatedItem(relatedItemListID,relatedItemID);
            
        }), 
        Function.createDelegate(this, function(sender, args){ // OnFail
            console.log(args.get_message());
        })
    );

    /** On déplace les boutons d'action vers leur emplacement de destination sur le template */
    $("table.ms-formtable + table").first().find("td.ms-toolbar[width='99%']").nextAll().appendTo($(".ibsn-task-outcome-editform"));
    /** On déplace les information de système SharePoint vers leur emplacement de destination sur le template */
    $("table.ms-formtable + table").first().contents().appendTo($(".ibsn-system-data"));
    
    /**
     * On cache les autres éléments de la page retournés par défaut par SharePoint
     */
    $("table.ms-formtable").hide();
    $("table.ms-formtable + table").hide();
    $(".ms-recommendations-panel").hide();
};

/**
 * Récupère l'élément connexe (fichier du courrier associé) de la liste de tâches de courrier
 * @param {string} listId 
 * @param {number} itemId 
 */
function displayRelatedItem(listId, itemId) {
    relatedItemList = this.web.get_lists().getById(listId);
    relatedItem     = relatedItemList.getItemById(itemId);

    this.ctx.load(relatedItem);
    this.ctx.executeQueryAsync(
        Function.createDelegate(this, function(sender, args){ // OnSuccess
            /** URL de l'élément connexe */
            var relatedItemUrl = relatedItem.get_item('ServerRelativeUrl');
            console.log(relatedItemUrl);

            /** On vérifie l'extension du fichier connexe */
            try {
                /** Extension du fichier connexe */
                var extension = relatedItemUrl.substr( (relatedItemUrl.lastIndexOf('.') +1) );
                /** Seuls les images et les fichiers PDF seront prévisualisés */
                var imageExtensions = ["JPEG", "JPG", "PNG"];
                var pdfExtensions = ["PDF"];
                
                /** Si le fichier connexe (le courrier scanné) est une image, on affiche une image */
                if($.inArray(extension.toUpperCase(), imageExtensions) >= 0) {
                    elem.html('<img src="'+relatedItemUrl+'"/>');
                }
                /** Si le fichier connexe (le courrier scanné) est un PDF, on affiche un iframe */
                else if($.inArray(extension.toUpperCase(), pdfExtensions) >= 0) {
                    elem.html('<iframe src="'+relatedItemUrl+'" allowfullscreen allowtransparency="true" frameborder="0" ></iframe>');
                }
                /** Si le fichier connexe n'est ni une image, ni un PDF, on affiche un message */
                else{
                    /** Sinon */
                    elem.html("<p>Le type de fichier uploadé ne peut être prévisualisé</p>");
                }
            } catch (error) {
                console.log("Erreur : "+error);
            }
        }), 
        Function.createDelegate(this, function(sender, args){ // OnFail
            console.log(args.get_message());
        })
    );

    return returnData;
}

/** Document ready */
$(function(){
    ExecuteOrDelayUntilScriptLoaded(moveCourrierRecuTaskFields, "sp.js");
});