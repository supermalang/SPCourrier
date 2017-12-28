import * as $ from "jquery"
import fonctions from "../fonctions"
let fnct = new fonctions();

/**
 * Démarre le workflow de classement du courrier reçu
 */
export default function classerCourrier() {
    SP.SOD.registerSod('sp.workflowservices.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.workflowservices.js'));
    SP.SOD.executeFunc('sp.workflowservices.js', "SP.WorkflowServices.WorkflowServicesManager", ()=>{
        let _subscriptionId = 'C63E96D0-A7C2-4000-8137-EE0593E76B5D';
        let _itemId = parseInt(GetUrlKeyValue('ID'));
        let confirm_classer = confirm("Voulez-vous vraiment classer ce courrier ? Si vous cliquez sur 'Oui' le courrier sera archivé il ne sera plus possible de le modifier.");
        if (confirm_classer == true) { fnct.StartWorkflow("Veuillez patienter..., Archivage du courrier en cours",_subscriptionId, _itemId) }
    });
}