/**
 * Organise le placement des champs des formulaires de tâche de courrier reçu dans le formulaire tacheCourrierRecu.form.html
 */
function moveCourrierRecuTaskFields(){
    /** Chemin relatif de la page active */
    var cheminRelatif = location.pathname;

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

    /** ID de l'utilisateur actif */
    var userID = _spPageContextInfo.userId;
    /** Récupération de l'ID de la liste Active et de l'ID de l'élément de liste actif */
    var listId = _spPageContextInfo.pageListId;
    var itemId = parseInt(GetUrlKeyValue('ID'));
    /** Tableau des éléments connexes (courriers associés à la tâche) */    
    var _getRelatedItems = $.Deferred();
    /** URL du premier élément connexe */
    var _getFirstRelatedItemUrl = $.Deferred();
    /** Propriétaire de la tache. */
    var _getTaskOwnerID = $.Deferred();
    
    /** Chargement du script contenant les fonctions personnalisées */
    $.getScript( "/SiteAssets/js/functions/functions.ibsn.js" )
    .done(function() {
        /** Récupère un tableau (string) contenant les éléments connexes de la tâche. getRelatedItems() est asynchrone */
        _getRelatedItems = getRelatedItems(listId,itemId);
        /** Une fois que le tableau d'éléments connexes est récupéré, on s'intéresse au 1er élément */
        _getRelatedItems.done(function(relatedItemsString){
            /** Conversion en tableau d'objets */
            relatedItems = JSON.parse(relatedItemsString);
            /** Récupération de l'URL du premier élément connexe. La fonction getRelatedItemFileUrl() est asynchrone */
            _getFirstRelatedItemUrl.resolve(getRelatedItemFileUrl( relatedItems[0].ListId,relatedItems[0].ItemId));
        });
        /** Prévisualisation du courrier connexe */
        $.when(_getFirstRelatedItemUrl).done(function(relatedItemURL){displayRelatedItem(relatedItemURL)});

        /** Dans la page de modification de tâche :
         *  Si l'utilisateur n'est pas le propriétaire de la tâche, on désactive les champs suivants :
         *      - Nom de la tâche; Date de début; Date d'échéance; Assigné à 
         *      - Description; Prédécesseurs; Priorité
         */
        if(cheminRelatif.indexOf("EditForm") >= 0) {
            console.log("le guid de la liste est : "+listId)
            _getTaskOwnerID = getItemOwnerID(listId,itemId);
            _getTaskOwnerID.done(function(taskOwnerID){
                if (taskOwnerID != userID) {
                    /** Champs à désactiver */
                    templatefieldsToProtect = $("[data-internal-name='Title'],[data-internal-name='StartDate'],[data-internal-name='DueDate'],[data-internal-name='AssignedTo'],[data-internal-name='Body'],[data-internal-name='Predecessors'],[data-internal-name='Priority']");
                    fieldsToProtect = $("[id^='Title'],[id^='StartDate'],[id^='DueDate'],[id^='AssignedTo'],[id^='Body'],[id^='Predecessors'],[id^='Priority']");

                    /** Désactivation des champs */
                    templatefieldsToProtect.css("pointer-events", "none");
                    templatefieldsToProtect.find(fieldsToProtect).attr("contentEditable","false");
                    templatefieldsToProtect.find(fieldsToProtect).prop('disabled', true);
                    descriptionTache = templatefieldsToProtect.find("div[id^='Body'][role='textbox']").text();
                    templatefieldsToProtect.find("div[id^='Body'][role='textbox']").parent().hide();
                    $("[data-internal-name='Body']").append("<p class='ibsn-description-tache'>"+descriptionTache+"</p>");
                }
            });
        }
    }) // Fin du chargement réussi de fichier
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
 * Affiche dans le panneau de prévisualisation le courrier connexe associé à la tâche en cours
 * @param {string} url 
 */
function displayRelatedItem(url) {
    /** Extension du courrier */
    var extension = url.substr( (url.lastIndexOf('.') +1) );
    /** Seuls les images et les fichiers PDF seront prévisualisés */
    var imageExtensions = ["JPEG", "JPG", "PNG"];
    var pdfExtensions = ["PDF"];
    /** Emplacement de prévisualisation du courrier */
    var previewerpanel = $(".ibsn-task-file-previewer span");
    /** Si le fichier connexe (le courrier scanné) est une image, on affiche une image */
    if($.inArray(extension.toUpperCase(), imageExtensions) >= 0) {
        previewerpanel.html('<img src="'+url+'"/>');
    }
    /** Si le fichier connexe (le courrier scanné) est un PDF, on affiche un iframe */
    else if($.inArray(extension.toUpperCase(), pdfExtensions) >= 0) {
        previewerpanel.html('<iframe src="'+url+'" allowfullscreen allowtransparency="true" frameborder="0" ></iframe>');
    }
    /** Si le fichier connexe n'est ni une image, ni un PDF, on affiche un message */
    else{
        previewerpanel.html("<p>Le type de fichier uploadé ne peut être prévisualisé</p>");
    }
}

/** Document ready */
$(function(){
    ExecuteOrDelayUntilScriptLoaded(moveCourrierRecuTaskFields, "sp.js");
});