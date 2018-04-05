import pnp from "sp-pnp-js"
import * as $ from "jquery"
pnp.setup(
    { sp: { headers: {
        'Accept': 'application/json; odata=verbose',
        'Content-Type': 'application/json; odata=verbose',
    } } });

export default function getStatsCourrier() {
    let nbCourriersDeposes = $.Deferred();
    let nbCourriersRecus = $.Deferred();
    let nbCourriersEnvoyes = $.Deferred();
    
    pnp.sp.web.lists.getByTitle("Boite%20de%20d%C3%A9pot").get().then((deposes) => {
        nbCourriersDeposes.resolve(deposes.ItemCount);
    }).catch((erreur)=> {console.log("Erreur :");console.log(erreur)});
    
    pnp.sp.web.lists.getByTitle("CourrierRecu").get().then((recus) => {
        nbCourriersRecus.resolve(recus.ItemCount);
    }).catch((erreur)=> {console.log("Erreur :");console.log(erreur)});
    
    pnp.sp.web.lists.getByTitle("CourrierEnvoye").get().then((envoyes) => {
        nbCourriersEnvoyes.resolve(envoyes.ItemCount);
    }).catch((erreur)=> {console.log("Erreur :");console.log(erreur)});

    $.when(nbCourriersRecus).done(function(nbcourrier){
        if(nbcourrier<=1){ $("#recusItemCount").html("  "+nbcourrier+" <i>Courrier Arrivé</i> enregistré"); }
        if(nbcourrier>1){ $("#recusItemCount").html("  "+nbcourrier+" <i>Courrier Arrivé</i> enregistrés"); }
    });
    
    $.when(nbCourriersEnvoyes).done(function(nbcourrier){
        if(nbcourrier<=1){ $("#envoyesItemCount").html("  "+nbcourrier+" <i>Courrier Départ</i> enregistré"); }
        if(nbcourrier>1){ $("#envoyesItemCount").html("  "+nbcourrier+" <i>Courrier Départ</i> enregistrés"); }
    });
    
    $.when(nbCourriersDeposes).done(function(nbcourrier){
        if(nbcourrier==0){ $("#dropOffItemCount").html("<img src='SiteAssets/img/icons/001-check.svg' style='width:16px;margin-left:-16px;'/> "+nbcourrier+" Courrier à décrire"); }
        if(nbcourrier==1){ $("#dropOffItemCount").html("<img src='SiteAssets/img/icons/003-exclamation.svg' style='width:16px;margin-left:-16px;'/> "+nbcourrier+" Courrier à décrire"); }
        if(nbcourrier>1){ $("#dropOffItemCount").html("<img src='SiteAssets/img/icons/003-exclamation.svg' style='width:16px;margin-left:-16px;'/> "+nbcourrier+" Courriers à décrire"); }
    });
}