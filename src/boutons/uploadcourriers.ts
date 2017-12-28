import pnp from "sp-pnp-js"
import * as $ from "jquery"
import fonctions from "../fonctions"
pnp.setup({ sp: { headers: { "Accept": "application/json; odata=verbose" } } });
let fnct = new fonctions();

/**
 * Paramètre sur les boutons de chargement de courrier le type de courrier (type de contenu) à charge
 */
export default function uploadcourrierButtons() {
    /** Content Type ID des Courriers Recu */
    let _getCourrierRecuCTid = $.Deferred();
    /** Content Type ID des Courriers Envoyés */
    let _getCourrierEnvoyeCTid = $.Deferred();
    _getCourrierRecuCTid.resolve(fnct.getContentTypeID("Courrier recu"));
    _getCourrierEnvoyeCTid.resolve(fnct.getContentTypeID("Courrier envoyé"));
    
    /** Paramétrage du bouton d'upload de courrier reçu */
    $.when(_getCourrierRecuCTid).done(function(courrierRecuContentTypeID) {
        var courrierRecuUploadFormUrl = "DropOffLibrary/Forms/upload.aspx?TypeDeContenu="+courrierRecuContentTypeID;
        $(".ibsn-upload-courrierentrant-button").attr('onclick',"javascript:OpenNewFormUrl('"+courrierRecuUploadFormUrl+"');return false;");
    });
    
    /** Paramétrage du bouton d'upload de courrier envoyé */
    $.when(_getCourrierEnvoyeCTid).done(function(courrierEnvoyeContentTypeID) {
        var courrierEnvoyeUploadFormUrl = "DropOffLibrary/Forms/upload.aspx?TypeDeContenu="+courrierEnvoyeContentTypeID;
        $(".ibsn-upload-courriersortant-button").attr('onclick',"javascript:OpenNewFormUrl('"+courrierEnvoyeUploadFormUrl+"');return false;");
    });
}