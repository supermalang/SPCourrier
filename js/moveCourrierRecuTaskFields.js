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

    /** Récupération de l'ID de la liste Active et de l'ID de l'élément de liste actif */
    var _getRelatedItems = $.Deferred();
    var _getFirstRelatedItemUrl = $.Deferred();
    var listId = _spPageContextInfo.pageListId;
    var itemId = parseInt(GetUrlKeyValue('ID'));
    
    $.getScript( "/SiteAssets/js/functions/functions.ibsn.js" )
    .done(function() {
        _getRelatedItems = getRelatedItems(listId,itemId);
        _getRelatedItems.done(function(relatedItemsString){
            relatedItems = JSON.parse(relatedItemsString);
            _getFirstRelatedItemUrl.resolve(getRelatedItemFileUrl(relatedItems[0].ListId,relatedItems[0].ItemId));
        });
        $.when(_getFirstRelatedItemUrl).done(function(relatedItemURL){displayRelatedItem(relatedItemURL) });

    })
    .fail(function( jqxhr, settings, exception ) { console.log("Le fichier n'a pu être chargé") });
        

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
    $(".ms-formline").hide();
    $(".ms-relateditems-core").hide();
};


/**
 * Récupère l'élément connexe (fichier du courrier associé) de la liste de tâches de courrier
 * @param {string} url 
 */
function displayRelatedItem(url) {
    /** Extension du fichier connexe */
    var extension = url.substr( (url.lastIndexOf('.') +1) );
    /** Seuls les images et les fichiers PDF seront prévisualisés */
    var imageExtensions = ["JPEG", "JPG", "PNG"];
    var pdfExtensions = ["PDF"];

    var previewerlocation = $(".ibsn-task-file-previewer span");
    
    /** Si le fichier connexe (le courrier scanné) est une image, on affiche une image */
    if($.inArray(extension.toUpperCase(), imageExtensions) >= 0) {
        previewerlocation.html('<img src="'+url+'"/>');
    }
    /** Si le fichier connexe (le courrier scanné) est un PDF, on affiche un iframe */
    else if($.inArray(extension.toUpperCase(), pdfExtensions) >= 0) {
        previewerlocation.html('<iframe src="'+url+'" allowfullscreen allowtransparency="true" frameborder="0" ></iframe>');
    }
    /** Si le fichier connexe n'est ni une image, ni un PDF, on affiche un message */
    else{
        /** Sinon */
        previewerlocation.html("<p>Le type de fichier uploadé ne peut être prévisualisé</p>");
    }
}

/** Document ready */
$(function(){
    ExecuteOrDelayUntilScriptLoaded(moveCourrierRecuTaskFields, "sp.js");
});