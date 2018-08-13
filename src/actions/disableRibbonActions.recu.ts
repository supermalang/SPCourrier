import * as $ from "jquery"
import fonctions from "../fonctions"

let fnct = new fonctions();

/**
 * Désactive les boutons d'actions personnalisés du courrier reçu selon, le niveau de traitement
 * Exigences fontionnelles :
 *    - Le destinataire du courrier peut (Classer, Assigner, Annoter, Partager)
 *    - Les personnes en copie peuvent (Assigner, Annoter, Partager)
 *    - Les autres peuvent (Afficher le courrier seulement)
 */
export default function disableSPRibbonActions_recus(){
    /** On commence par désactiver temporairement tous les boutons d'actions personnalisés (à l'aide de propriétés CSS, plutôt qu'en supprimant les eventHandlers) */
    $(".ms-cui-ctl-largelabel").parent('a').css("pointer-events", "none");
    $(".ms-cui-ctl-largelabel").parent('a').addClass("ms-cui-row ibsn-cui-disabled");

    let     ctx = SP.ClientContext.get_current(),
            web = ctx.get_web();

    /** Récupération de l'ID de la liste Active et de l'ID de l'élément de liste actif */
    let     listId = _spPageContextInfo.pageListId,
            itemId = parseInt(GetUrlKeyValue('ID'));

    /** Utilisateur Actif */
    let currentUser = web.get_currentUser();

    /** Récupération du courrier (l'élément de liste) */
    let     list = web.get_lists().getById(listId),
            listItem = list.getItemById(itemId);

    /** Actions personnalisées utilisateur (Boutons du ruban) */
    let userCustomActions = list.get_userCustomActions();

    ctx.load(currentUser);
    ctx.load(listItem);
    ctx.load(userCustomActions);
    
    ctx.executeQueryAsync(
        function(sender, args){// On Success
            /** Destinataire du courrier */
            let destinataire = listItem.get_item('DestinataireCourrierRecu').$2e_1;
    
            /** Etat du courrier  */
            let etatCourrier = listItem.get_item('EtatCourrier');
        
            /** Nom de l'utilsateur Actif */
            let utilisateurConnecte = currentUser.get_title();
        
            /** Liste des actions personnalisées */
            let  customActionEnumerator = userCustomActions.getEnumerator();
        
            /** Parcours la liste des actions personnalisées */
            while (customActionEnumerator.moveNext()) {
                /** Action personnalisée parcourur */
                let userCustomAction = customActionEnumerator.get_current();
                /** Titre de l'action personnalisée */
                let customActionTitle = userCustomAction.get_title();
                
                switch(customActionTitle) {
                    case 'Classer':
                        /**
                         * L'action 'Classer' peut être activée uniquement si les conditions suivantes sont respectées :
                         *  - L'utilisateur actif est le propriétaire du courrier
                         *  - Le courrier n'est pas dans l'état 'Terminé'
                         * Si les conditions ne sont pas respectées alors l'action reste désactivée
                         */
                        if (destinataire == utilisateurConnecte && etatCourrier!="Terminé" && etatCourrier!="En Attente"){
                            $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').removeClass("ibsn-cui-disabled");
                            $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').css("pointer-events", "auto");
                        }
                    break;
                    case 'Transferer':
                    /**
             * L'action 'Transferer' peut être activée uniquement si les conditions suivantes sont respectées :
             *  - L'utilisateur actif est le secretaire général
             *  
             *  - Le courrier n'est pas dans l'état 'Transféré'
             * Si les conditions ne sont pas respectées alors l'action reste désactivée
             */ 
                      $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').removeClass("ibsn-cui-disabled");
                      $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').css("pointer-events", "auto");
                    
                break;
                    case 'Assigner':
                        /**
                         * L'action 'Assigner' peut être activée uniquement si les conditions suivantes sont respectées :
                         *  - L'utilisateur actif est le propriétaire du courrier
                         *  - L'utilisateur actif est en copie du courrier
                         *  - Le courrier n'est pas dans l'état 'En Attente'
                         *  - Le courrier n'est pas dans l'état 'Terminé'
                         * Si les conditions ne sont pas respectées alors l'action est désactivée
                         */
                        if (destinataire == utilisateurConnecte && etatCourrier!="Terminé" && etatCourrier!="En Attente"){
                            $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').removeClass("ibsn-cui-disabled");
                            $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').css("pointer-events", "auto");
                        }
                    break;
        
                    case 'Annoter':
                        /**
                         * L'action 'Annoter' peut être activée uniquement si les conditions suivantes sont respectées :
                         *  - L'utilisateur actif est le propriétaire du courrier
                         *  - L'utilisateur actif est en copie du courrier
                         *  - Le courrier n'est pas dans l'état 'Terminé'
                         * Si les conditions ne sont pas respectées alors l'action reste désactivée
                         */
                        if (destinataire == utilisateurConnecte && etatCourrier!="Terminé"){
                            $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').removeClass("ibsn-cui-disabled");
                            $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').css("pointer-events", "auto");
                        }
                    break;
        
                    case 'Partager':
                        /**
                         * L'action 'Partager' peut être activée uniquement si les conditions suivantes sont respectées :
                         *  - L'utilisateur actif est le propriétaire du courrier
                         *  - L'utilisateur actif est en copie du courrier
                         *  - Le courrier n'est pas dans l'état 'Terminé'
                         * Si les conditions ne sont pas respectées alors l'action est désactivée
                         */
                        if (destinataire == utilisateurConnecte && etatCourrier!="Terminé"){
                            $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').removeClass("ibsn-cui-disabled");
                            $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').css("pointer-events", "auto");
                        }
                    break;
                
                    default:
                        break;
                }// Fin Switch
            }// Fin While
        }, // FIn On Success
        function(sender, args){ console.log(args.get_message()); } // On Fail
    ); // Fin executeQueryAsync()
}