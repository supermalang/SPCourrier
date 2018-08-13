import pnp from "sp-pnp-js"
import * as $ from "jquery"
import fonctions from "../fonctions"
let fnct = new fonctions();

/**
 * Organise le placement des champs des formulaires de courrier dans le formulaire courrierForm.html
 */
export default function organizeCourrierFields(){
    /** Chemin relatif de la page active */
    var cheminRelatif = location.pathname;

    $(".ibsn-field-value").each(function(){
        let internalName = $(this).attr("data-internal-name");
        let elem = $(this);
        let elemLabel = elem.prev('.ibsn-standardheader');

        /** Parcourt les champs du formulaire par défaut présenté par SharePoint */
        $("table.ms-formtable td").each(function(){
            /** Pour les champs de courrier simple */
            if(this.innerHTML.indexOf('FieldInternalName="'+internalName+'"') != -1 ){
                $(this).prev().contents().appendTo(elemLabel);
                $(this).contents().appendTo(elem);
            }

            /** Si le champ est le champ du fichier de scanné, on l'ajoute dans le panneau de prévisualisation */
            else if(this.innerHTML.indexOf('FieldInternalName="FileLeafRef"') != -1){
                var urlFichierCourrier = $(this).find("[rel=sp_DialogLinkNavigate]").attr("href");

                /** Si on est dans la boîte de dépot, on construit l'URL du fichier */
                if(urlFichierCourrier==null){
                    urlFichierCourrier = _spPageContextInfo.siteAbsoluteUrl+"/DropOffLibrary/" + $(this).find("input[id*=FileLeafRef]").val() + $(this).find("input[id*=FileLeafRef] + .ms-fileField-fileExt").html();
                }

                /** On vérifie l'extension du fichier */
                var extension = urlFichierCourrier.substr( (urlFichierCourrier.lastIndexOf('.') +1) );

                /** On accepte d'afficher seulement les fichiers PDF et les Images */
                var imageExtensions = ["JPEG", "JPG", "PNG"];
                var pdfExtensions = ["PDF"];

                /** Si le fichier du courrier est une image, on affiche une image */
                if($.inArray(extension.toUpperCase(), imageExtensions) >= 0) {
                    $(".ibsn-file-previewer").html('<img class="ibsn-courrier-file" src="'+urlFichierCourrier+'"/>');
                }
                /** Si le fichier du courrier est un PDF, on affiche un iframe */
                else if($.inArray(extension.toUpperCase(), pdfExtensions) >= 0) {
                    $(".ibsn-file-previewer").html('<iframe class="ibsn-courrier-file" src="'+urlFichierCourrier+'" allowfullscreen allowtransparency="true" frameborder="0" ></iframe>');
                }
                else{
                    /** Sinon */
                    $(".ibsn-file-previewer").html("<p>Le type de fichier uploadé ne peut être prévisualisé</p>");
                }
            }

            /** Pour le champ qui permet de sélectionner le type de courrier (Dans la boîte de dépôt ) */
            else if(this.innerHTML.indexOf('ContentTypeChoice') != -1){
                $(".ibsn-file-previewer").css("width", "58%");
                $(".ibsn-courrier-metadata").css("width", "41%");
                $(this).contents().appendTo("span[data-internal-name='ContentTypeChoice']");
            }
        });

        /**
         * Si le champ du formulaire n'est pas utilisé, on le cache
         * Ex : Certains champs de courriers reçu ne sont pas utilisés dans le courrier envoyé
         */
        if (elem.is(':empty')){
            elem.parent().hide();
        }
        /** Dans la page de détails (Display Form) de courrier, on cache les champs vides */
        if(cheminRelatif.indexOf("DispForm") >= 0){
            /** On clone d'abord le champ, puis on supprime les commentaires inclus avant de vérifier si le champ est totalement vide */
            var elemclone = elem.clone();
            elemclone.contents().filter(function() {
                return this.nodeType == 8;
                //return this.nodeType == Node.COMMENT_NODE;
            }).remove();
    
            /** Si le clone, sans les commentaires est vide, alors on cache le champ */
            if(!elemclone.html().replace(/\r?\n|\r|\t|\/ \//g,'').length){
                elem.parent().hide();
            }
            $(".ibsn-selecteur").hide();
        }
    });

    /** Si on est dans une page d'édition (Ex : page de description dans la boîte de dépôt)' */
    if(cheminRelatif.indexOf("EditForm") >= 0) {
        /** On alterne la visibilité de l'affichage des éléments .ibsn-toogle à l'aide d'un clic sur un bouton */
        /** Les éléments .ibsn-toogle sont des champs de texte optionnels, réduits par défaut. Pour ajouter des données on l'affiche (agrandit) l'élément */
        $(".ibsn-toggle").each(function(){
            /** Le champ est d'abord caché */
            $(this).next().hide();
            /** Ajout du lien cliquable qui va actionner le basculement de la visibilité */
            $(this).append("<a class='ibsn-right ibsn-toggle-button' style='position:relative;top:-15px;'>Ajouter</a>");
            /** Basculement de la visibilité du champ */
            $(this).find(".ibsn-toggle-button").click(function(){
                var buttonText = $(this).text() == "Ajouter" ? "Annuler" : "Ajouter" ;
                $(this).text(buttonText);
                $(this).parent().next().find('textarea').val('');
                $(this).parent().next().toggle(500);
            });
            /** On force aux utilisateurs de faire un choix sur le type de contenu à utiliser, plutôt que d'utiliser un choix par défaut */
            /** Pour celà on ajoute une option vide au sélecteur de type de contenu */
            /* $("[data-internal-name='ContentTypeChoice'] select").prepend("<option class='ibsn-readonly-option' >Sélectionnez le type du courrier</option>");*/
            /** Et on supprime tous les Event Handlers */
            $(".ibsn-readonly-option").off();
        });
        
        /** Gestion du toggle pour l'expéditeur du courrier entrant */
        $('.ibsn-courrier-expediteur-interne').hide();
        $("input[name='typeExpediteur'").click(function(){
            if($("#expediteurExterne").is(':checked')){ $(".ibsn-courrier-expediteur-interne").hide();$(".ibsn-courrier-expediteur-externe").show(); }
            if($("#expediteurInterne").is(':checked')){ 
                $(".ibsn-courrier-expediteur-externe").hide();$(".ibsn-courrier-expediteur-interne").show(); 

                /** On remplit automatiquement les champs Structure (Département) et Adresse (Adresse + Téléphone) */
                    /** 1. On récupère d'abord le département de l'expéditeur */
                    let _department = $.Deferred();
                    pnp.sp.profiles.getUserProfilePropertyFor("SDE\\ssane","AccountName").then((dpt) => {
                        _department.resolve(dpt.toUpperCase);
                        $.when(_department).done(function(department){
                            console.log("L'utilisateur sélectionné est : "+$("#expediteurInterne").val());
                            console.log("Le département de Syaka est : "+department);

                        });
                    }).catch((erreur)=> {console.log("Erreur :");console.log(erreur)});
            }
        })

        /** Gestion du toggle pour l'expéditeur du courrier sortant */
        $('.ibsn-courrier-destinataire-interne').hide();
        $("input[name='typeDestinataire'").click(function(){
            if($("#destinataireInterne").is(':checked')){ $(".ibsn-courrier-destinataire-externe").hide();$(".ibsn-courrier-destinataire-interne").show(); }
            if($("#destinataireExterne").is(':checked')){ $(".ibsn-courrier-destinataire-interne").hide();$(".ibsn-courrier-destinataire-externe").show(); }
        })

        /** On cache les éléments qu'on ne doit pas afficher dans le formulaire d'édition */
        $(".ibsn-readonly").hide();
        $(".ibsn-displayonly").hide();
        /** On en profite pour cacher cet élément */
        $("table.ms-formtoolbar").parent().hide();

        /** Comportement du courrier confidentiel */
        $("span[data-internal-name='NatureCourrier'] input[type='radio']").change(function(){
            /** Si le courrier est confidentiel */
            if($(this).is(':checked') && $(this).val() =="Confidentiel"){
                console.log("Courrier Confidentiel");
                /** 1. On supprime le champ "Partagé avec" */
                $("span[data-internal-name='DestinataireEnCopieCourrier'] input").val('');
                $("span[data-internal-name='DestinataireEnCopieCourrier']").parent().hide();
                /** 2. On supprime le champ "Mots Clés" */
                $("span[data-internal-name='MotsClesCourrier'] input").val('');
                $("span[data-internal-name='MotsClesCourrier']").parent().hide();
                /** 3. On supprime le champ "Observations" */
                $("span[data-internal-name='Observations'] input").val('');
                $("span[data-internal-name='Observations']").parent().hide();
                /** 4. On supprime le champ "Emplacement" */
                $("span[data-internal-name='EmplacementPhysique'] input").val('');
                $("span[data-internal-name='EmplacementPhysique']").parent().hide();
                
                /** 5. On met le champ Objet en readonly */
                $("span[data-internal-name='ObjetCourrier'] input").val("COURRIER CONFIDENTIEL");
                $("span[data-internal-name='ObjetCourrier'] input").prop('readonly', true);
                
                /** 6. On met un placeholder dans le champ destinataire/expediteur */
                $("span[data-internal-name='ExpediteurExterneCourrierRecu'] input").val("Inconnu");
                $("span[data-internal-name='DestinataireExterneCourrierEnvoye'] input").val("Inconnu");
                 /** 3. On met le champ DateCourrier Obligatoire */
                                
            }
            /** Sinon */
            else{
                console.log("Courrier Ordinaire");
                /** 1. On remet le champ partager */
                $("span[data-internal-name='DestinataireEnCopieCourrier']").parent().show();
                /** 1. On remet le champ Mots Clés */
                $("span[data-internal-name='MotsClesCourrier']").parent().show();
                /** 1. On remet le champ Observations */
                $("span[data-internal-name='Observations']").parent().show();
                /** 1. On remet le champ Emplacement */
                $("span[data-internal-name='EmplacementPhysique']").parent().show();
                
                /** 2. On enlève le readonly du champ Objet */
                $("span[data-internal-name='ObjetCourrier'] input").val("");
                $("span[data-internal-name='ObjetCourrier'] input").prop('readonly', false);
                
                /** 3. On met un placeholder dans le champ destinataire/expediteur */
                $("span[data-internal-name='ExpediteurExterneCourrierRecu'] input").val("");
                $("span[data-internal-name='DestinataireExterneCourrierEnvoye'] input").val("");
               
                
            }
        })

    }

    
    /** On déplace les boutons d'action vers leur emplacement de destination sur le template */
    $("table.ms-formtable + table").first().find("td.ms-toolbar[width='99%']").nextAll().appendTo($(".ibsn-field-actionbuttons"));
    $("table.ms-formtoolbar").eq(1).find("td.ms-toolbar[width='99%']").nextAll().appendTo($(".ibsn-field-actionbuttons"));
    /** On déplace les information de système SharePoint vers leur emplacement de destination sur le template */
    $("table.ms-formtable + table").first().contents().appendTo($(".ibsn-system-data"));
    $("table.ms-formtoolbar").eq(1).contents().appendTo($(".ibsn-system-data"));
    
    /**
     * On cache les autres éléments de la page retournés par défaut par SharePoint
     */
    $("table.ms-formtable").hide();
    $("table.ms-formtable + table").hide();
    $(".ms-recommendations-panel").hide();
    $(".ms-formline").hide();

    /** Si on ne se trouve pas dans la page de répertoire de dépôt */
    if(!location.pathname.substring(1).includes("DropOffLibrary")){
        $(".ibsn-system-data > tbody:nth-child(2)").hide();
    }
    
    /** Dans le EditForm (Formulaire de description du courrier) on sélectionne du type de contenu par défaut.
     *  Cette sélection est paramétrable à parir de l'URL, avec le paramétre 'TypeDeContenu' qui doit contenir le GUID du type de contenu
     *  qu'on veut sélectionner par défaut
     */
    /** Type de contenu à sélectionner par défaut */
    var contentTypeID = fnct.getUrlParameter('TypeDeContenu');
    /** Si le paramétre est défini */
    if (typeof contentTypeID !== 'undefined') {
        /** Sélection sélection d'un type de courrier (type de contenu) par défaut */
        fnct.autoselectContentType(contentTypeID);
    }
    
    /** On ajoute un signal visuel (Border-left), selon l'état du courrier */
    var descriptionEtat = $(".ibsn-state-signal");
    /** Si c'est un nouveau courrier on ajoute un signal bleu */
    if(descriptionEtat.text().toUpperCase().indexOf("NOUVEAU") != -1 ){ descriptionEtat.addClass("ibsn-signal-left-border-blue"); }
    /** Si c'est un courrier en traitement on ajoute un signal jaune/orange */
    if(descriptionEtat.text().toUpperCase().indexOf("TRAITEMENT") != -1 ){ descriptionEtat.addClass("ibsn-signal-left-border-yellow"); }
    /** Si c'est un courrier en attente  on ajoute un signal gris */
    if(descriptionEtat.text().toUpperCase().indexOf("ATTENTE") != -1 ){ descriptionEtat.addClass("ibsn-signal-left-border-grey"); }
    /** Si c'est un courrier terminé on ajoute un signal vert */
    if(descriptionEtat.text().toUpperCase().indexOf("TERMINÉ") != -1 ){ descriptionEtat.addClass("ibsn-signal-left-border-green"); }
    if(descriptionEtat.text().toUpperCase().indexOf("CLASSÉ") != -1 ){ descriptionEtat.addClass("ibsn-signal-left-border-green"); }
};

