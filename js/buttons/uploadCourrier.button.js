/**
 * Paramètre sur les boutons de chargement de courrier le type de courrier (type de contenu) à afficher
 */
function uploadCourrierButtons() {
    var _getCourrierRecuCTid = $.Deferred();
    var _getCourrierEnvoyeCTid = $.Deferred();
    
    /** On charge le fichier des fonction personnalisées et on récupère les GUID des types de contenu de courrier */
    $.getScript( "/SiteAssets/js/functions/functions.ibsn.js" )
    .done(function() {
        _getCourrierRecuCTid.resolve(getContentTypeID("Courrier recu"));
        _getCourrierEnvoyeCTid.resolve(getContentTypeID("Courrier envoyé"));
    }).fail(function( jqxhr, settings, exception ) { console.log("Le fichier n'a pu être chargé") });
    
    /** Paramétrage du bouton d'upload de courrier reçu */
    $.when(_getCourrierRecuCTid).done(function(courrierRecuContentTypeID) {
        var courrierRecuUploadFormUrl = "/DropOffLibrary/Forms/upload.aspx?TypeDeContenu="+courrierRecuContentTypeID;
        $(".ibsn-upload-courrierentrant-button").attr('onclick',"javascript:OpenNewFormUrl('"+courrierRecuUploadFormUrl+"');return false;");
    });
    
    /** Paramétrage du bouton d'upload de courrier envoyé */
    $.when(_getCourrierEnvoyeCTid).done(function(courrierEnvoyeContentTypeID) {
        var courrierEnvoyeUploadFormUrl = "/DropOffLibrary/Forms/upload.aspx?TypeDeContenu="+courrierEnvoyeContentTypeID;
        $(".ibsn-upload-courriersortant-button").attr('onclick',"javascript:OpenNewFormUrl('"+courrierEnvoyeUploadFormUrl+"');return false;");
    });
}
_spBodyOnLoadFunctionNames.push("uploadCourrierButtons");