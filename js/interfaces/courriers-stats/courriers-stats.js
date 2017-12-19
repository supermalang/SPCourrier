/**
 * Récupère le nombre de courriers reçus les 30 derniers jours.
 * Utilise l'API REST de SharePoint
 * La valeur retournée sera affichée dans l'élément DOM ayant l'ID #recusItemCount
 */
function getCourrierStats() {
    /** Le Nombre de courriers reçus */
    var nbCourriersRecus = $.Deferred();
    /** Le nombre de courriers envoyés */
    var nbCourriersEnvoyes = $.Deferred();
    /** Le nombre de courriers déposés */
    var nbCourriersDeposes = $.Deferred();

    // Calcul de la date la plus ancienne (J-30)
    var myDate = new Date();  
    var today = myDate.getDate();
    myDate.setDate(today - 30);  

    // Chaîne de filtre de la requête
    var filter = "DateCourrier gt datetime'"+myDate.toISOString()+"'";

    $.getScript( "/SiteAssets/js/functions/functions.ibsn.js" )
    .done(function(){
        nbCourriersDeposes.resolve(countListItems("Boite de dépot"));
        nbCourriersRecus.resolve(countListItems("CourrierRecu",filter));
        nbCourriersEnvoyes.resolve(countListItems("CourrierEnvoye",filter));
    }).fail(function( jqxhr, settings, exception ) { console.log("Le fichier n'a pu être chargé") });

        $.when(nbCourriersRecus).done(function(nbcourrier){
            if(nbcourrier<=1){ $("#recusItemCount").html("  "+nbcourrier+" <i>Courrier Arrivé</i> enregistré ces 30 derniers jours"); }
            if(nbcourrier>1){ $("#recusItemCount").html("  "+nbcourrier+" <i>Courrier Arrivé</i> enregistrés ces 30 derniers jours"); }
        });
        
        $.when(nbCourriersEnvoyes).done(function(nbcourrier){
            if(nbcourrier<=1){ $("#envoyesItemCount").html("  "+nbcourrier+" <i>Courrier Départ</i> enregistré ces 30 derniers jours"); }
            if(nbcourrier>1){ $("#envoyesItemCount").html("  "+nbcourrier+" <i>Courrier Départ</i> enregistrés ces 30 derniers jours"); }
        });
        
        $.when(nbCourriersDeposes).done(function(nbcourrier){
            if(nbcourrier==0){ $("#dropOffItemCount").html("<img src='/SiteAssets/img/icons/001-check.svg' style='width:16px;margin-left:-16px;'/> "+nbcourrier+" Courrier à décrire"); }
            if(nbcourrier==1){ $("#dropOffItemCount").html("<img src='/SiteAssets/img/icons/003-exclamation.svg' style='width:16px;margin-left:-16px;'/> "+nbcourrier+" Courrier à décrire"); }
            if(nbcourrier>1){ $("#dropOffItemCount").html("<img src='/SiteAssets/img/icons/003-exclamation.svg' style='width:16px;margin-left:-16px;'/> "+nbcourrier+" Courriers à décrire"); }
        });
};
_spBodyOnLoadFunctionNames.push("getCourrierStats");   