import * as $ from "jquery"
import fonctions from "../fonctions"
let fnct = new fonctions();

/**
 * Démarre le workflow de classement du courrier reçu
 */
export default function classerCourrier() {
    SP.SOD.registerSod('sp.workflowservices.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.workflowservices.js'));
    SP.SOD.executeFunc('sp.workflowservices.js', "SP.WorkflowServices.WorkflowServicesManager", ()=>{
        //let _subscriptionId = 'C63E96D0-A7C2-4000-8137-EE0593E76B5D';
        let _itemId = parseInt(GetUrlKeyValue('ID'));
        /** GUID de la liste Active */
        let listGuid = _spPageContextInfo.pageListId;
        /** ID du workflow qu'on veut exécuter */
        let wfId = $.Deferred();
        wfId.resolve(fnct.getWorkflowId(listGuid,"Courrier Entrant - Classer"));
        
        let confirm_classer = confirm("Voulez-vous vraiment classer ce courrier ? Après validation, le courrier ne pourra plus être modifié");
        
        $.when(wfId).done(function(_wfId){
            //console.log("Workflow ID : "+wfId);
            if (confirm_classer == true) { fnct.StartWorkflow("Archivage du courrier","Veuillez patienter...",_wfId, _itemId); window.location.href = "/courriers/" }
        });
    });
}