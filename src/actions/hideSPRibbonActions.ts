import * as $ from "jquery"

/**
 * Cache les boutons par défaut du ruban SharePoint, pour laisser apparaître uniquement les boutons d'actions personnalisées
 */
export default function hideSPRibbonActions(){
    $("#Ribbon\\.ListForm\\.Display\\.Manage\\.EditItem-Large").hide();
    $("#Ribbon\\.ListForm\\.Display\\.Manage-LargeMedium-1").hide();
    $("#Ribbon\\.ListForm\\.Display\\.Manage\\.CheckOut-Large").hide();
    $("#Ribbon\\.ListForm\\.Display\\.Actions-LargeMedium-1").hide();
    $("#Ribbon\\.ListForm\\.Display\\.Manage\\.CheckIn-Large").hide();
}