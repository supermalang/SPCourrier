import pnp from "sp-pnp-js"
import * as $ from "jquery"
pnp.setup({ sp: { headers: { "Accept": "application/json; odata=verbose" } } });

export default function getStatsCourrier() {
    let nbCourriersDeposes = $.Deferred();
    let nbCourriersRecus = $.Deferred();
    let nbCourriersEnvoyes = $.Deferred();
    
    pnp.sp.web.lists.getByTitle("Boite de dépot").items.get().then((deposes: any[]) => {
        nbCourriersDeposes.resolve(deposes.length);
    });
    
    pnp.sp.web.lists.getByTitle("CourrierRecu").items.get().then((recus: any[]) => {
        nbCourriersRecus.resolve(recus.length);
    });
    
    pnp.sp.web.lists.getByTitle("CourrierEnvoye").items.get().then((envoyes: any[]) => {
        nbCourriersEnvoyes.resolve(envoyes.length);
    });

    $.when(nbCourriersRecus).done(function(nbcourrier){
        if(nbcourrier<=1){ $("#recusItemCount").html("  "+nbcourrier+" <i>Courrier Arrivé</i> enregistré ces 30 derniers jours"); }
        if(nbcourrier>1){ $("#recusItemCount").html("  "+nbcourrier+" <i>Courrier Arrivé</i> enregistrés ces 30 derniers jours"); }
    });
    
    $.when(nbCourriersEnvoyes).done(function(nbcourrier){
        if(nbcourrier<=1){ $("#envoyesItemCount").html("  "+nbcourrier+" <i>Courrier Départ</i> enregistré ces 30 derniers jours"); }
        if(nbcourrier>1){ $("#envoyesItemCount").html("  "+nbcourrier+" <i>Courrier Départ</i> enregistrés ces 30 derniers jours"); }
    });
    
    $.when(nbCourriersDeposes).done(function(nbcourrier){
        if(nbcourrier==0){ $("#dropOffItemCount").html("<img src='SiteAssets/img/icons/001-check.svg' style='width:16px;margin-left:-16px;'/> "+nbcourrier+" Courrier à décrire"); }
        if(nbcourrier==1){ $("#dropOffItemCount").html("<img src='SiteAssets/img/icons/003-exclamation.svg' style='width:16px;margin-left:-16px;'/> "+nbcourrier+" Courrier à décrire"); }
        if(nbcourrier>1){ $("#dropOffItemCount").html("<img src='SiteAssets/img/icons/003-exclamation.svg' style='width:16px;margin-left:-16px;'/> "+nbcourrier+" Courriers à décrire"); }
    });
}