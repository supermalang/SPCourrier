import * as $ from "jquery"
import pnp from "sp-pnp-js"
import fonctions from "../fonctions"
pnp.setup({ sp: { headers: { "Accept": "application/json; odata=verbose" } } });
let fnct = new fonctions();

/**
 * Organise le placement des champs des formulaires de tâche de courrier reçu dans le formulaire tacheCourrierRecu.form.html
 */
export default function organizeCourrierTasksFields(){
    /** Chemin relatif de la page active */
    let cheminRelatif = location.pathname;
    /** ID de l'utilisateur actif */
    let userID = _spPageContextInfo.userId;
    /** GUID de la liste Active */
    let listGuid = _spPageContextInfo.pageListId;
    /** Nom de la liste Active */
    let listTitle = $.Deferred();
    /** ID de l'élément de liste actif */
    let itemId = parseInt(GetUrlKeyValue('ID'));
    /** Tableau des éléments connexes (courriers associés à la tâche) */    
    let _getRelatedItems = $.Deferred();
    /** URL du premier élément connexe */
    let _getFirstRelatedItemUrl = $.Deferred();
    /** Propriétaire de la tache. */
    let _getTaskOwnerID = $.Deferred();

    /** Organisation des champs : Déplacement vers notre formulaire personnalisé */
    $(".ibsn-field-value").each(function(){
        let internalName = $(this).attr("data-internal-name");
        let elem = $(this);
        let elemLabel = elem.prev('h3');

        /** Parcourt les champs du formulaire par défaut présenté par SharePoint */
        $("table.ms-formtable td").each(function(){
            /** On déplace chaque champ par défaut vers son emplacement sur le template personnalisé */
            if(this.innerHTML.indexOf('FieldInternalName="'+internalName+'"') != -1 ){
                    $(this).prev().contents().appendTo(elemLabel);
                    $(this).contents().appendTo(elem);
            }
        });// Fin du each sur la table
    });// Fin du each parent

    /** On déplace les boutons d'action vers leur emplacement de destination sur le template */
    $("table.ms-formtable + table").first().find("td.ms-toolbar[width='99%']").nextAll().appendTo($(".ibsn-task-outcome-editform"));
    /** On cache l'action 'Refuser'. Il y aura une autre action 'Refuser' sur le Ruban */
    $(".ibsn-task-outcome-editform input[type='button'][value='Refuser']").hide();

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

    /** Affichage du courrier associé (élément connexe) */

    /** Récupération le nom de la liste active */
    pnp.sp.web.lists.getById(listGuid).get().then((result) => {
        listTitle.resolve(result.Title )
    })

    /** Récupération de l'ID du propriétaire (créateur) de la tâche */
    pnp.sp.web.lists.getById(listGuid).items.getById(itemId).get().then(result => {
        _getTaskOwnerID.resolve( result.AuthorId );
    });

    /** Après avoir récupéré le nom de la liste active, on récupère les éléments connexes de l'élément actif (la tâche)*/
    $.when(listTitle).done(function(_listTitle){
        pnp.sp.web.relatedItems.getRelatedItems(_listTitle, itemId).then((result) => {
            /** Bon, là je fais une petite bricole pour pouvoir convertir manipuler le résultat
             * Nous avons un résultat de type RelatedItem[]
             * Je le convertis en string puis en objet (simple) à nouveau afin de pouvoir le manipuler plus facilement
             */
            let _result = JSON.stringify(result);
            let __result = JSON.parse(_result);
            _getFirstRelatedItemUrl.resolve(__result.GetRelatedItems.results[0].Url);
        });
    })

    /** Prévisualisation du courrier associé */
    $.when(_getFirstRelatedItemUrl).done(function(relatedItemURL){fnct.displayFile(relatedItemURL,".ibsn-task-file-previewer span")});

    /** Protection des champs du formulaire de tâche */
    /** Dans la page de modification de tâche :
     *  Si l'utilisateur n'est pas le propriétaire de la tâche, on désactive les champs suivants :
     *      - Nom de la tâche; Date de début; Date d'échéance; Assigné à 
     *      - Description; Prédécesseurs; Priorité
     */
    if(cheminRelatif.indexOf("EditForm") >= 0) {
        _getTaskOwnerID.done(function(taskOwnerID){
            if (taskOwnerID != userID) {
                /** Champs à désactiver */
                let templatefieldsToProtect = $("[data-internal-name='Title'],[data-internal-name='StartDate'],[data-internal-name='DueDate'],[data-internal-name='AssignedTo'],[data-internal-name='Body'],[data-internal-name='Predecessors'],[data-internal-name='Priority']");
                let fieldsToProtect = $("[id^='Title'],[id^='StartDate'],[id^='DueDate'],[id^='AssignedTo'],[id^='Body'],[id^='Predecessors'],[id^='Priority']");

                /** Désactivation des champs */
                templatefieldsToProtect.css("pointer-events", "none");
                templatefieldsToProtect.find(fieldsToProtect).attr("contentEditable","false");
                templatefieldsToProtect.find(fieldsToProtect).prop('disabled', true);
                let descriptionTache = templatefieldsToProtect.find("div[id^='Body'][role='textbox']").text();
                templatefieldsToProtect.find("div[id^='Body'][role='textbox']").parent().hide();
                $("[data-internal-name='Body']").append("<p class='ibsn-description-tache'>"+descriptionTache+"</p>");
            }
        });
    }// Fin traitement Protection des champs
}