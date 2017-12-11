/**
 * Paramètre sur les boutons de chargement de courrier le type de courrier (type de contenu) à afficher
 */
function uploadCourrierButtons() {
    /** Paramétrage du bouton d'upload de courrier reçu */
    var courrierRecuCTobject = $.Deferred();
    courrierRecuCTobject.resolve(getContentTypeID("Courrier recu"));
    $.when(courrierRecuCTobject).done(function(courrierRecuContentTypeID) {
        var courrierRecuUploadFormUrl = "/DropOffLibrary/Forms/upload.aspx?TypeDeContenu="+courrierRecuContentTypeID;
        $(".ibsn-upload-courrierentrant-button").attr('onclick',"javascript:OpenNewFormUrl('"+courrierRecuUploadFormUrl+"');return false;");
    });
    
    /** Paramétrage du bouton d'upload de courrier envoyé */
    var courrierEnvoyeCTobject = $.Deferred();
    courrierEnvoyeCTobject.resolve(getContentTypeID("Courrier envoye"));
    $.when(courrierEnvoyeCTobject).done(function(courrierEnvoyeContentTypeID) {
        var courrierEnvoyeUploadFormUrl = "/DropOffLibrary/Forms/upload.aspx?TypeDeContenu="+courrierEnvoyeContentTypeID;
        $(".ibsn-upload-courriersortant-button").attr('onclick',"javascript:OpenNewFormUrl('"+courrierEnvoyeUploadFormUrl+"');return false;");
    });
}

/**
 * Renvoie le contentTypeID d'un type de contenu, de façon asynchrone
 * @param {string} ctName Nom du type de contenu
 */
function getContentTypeID(ctName) {
    // Chaîne de filtre de la requête
    var filter        = "Name eq '"+ctName+"'";
    var contentTypeID = $.Deferred();

    // Requête
    $.ajax({
        url: "/_api/web/AvailableContentTypes?$select=Name,StringId&$filter="+filter,
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'Application/json;odata=verbose');
            xhr.setRequestHeader('Content-Type', 'Application/json;odata=verbose');
        },
        success: function(data) { 
            contentTypeID.resolve(data.d.results[0].StringId);
        }
    })
    return contentTypeID;
};

_spBodyOnLoadFunctionNames.push("uploadCourrierButtons");
