/**
 * Désactive les boutons d'actions personnalisés selon les informations du courrier
 * Exigences fontionnelles 
 *    - Le destinataire du courrier peut (Classer, Assigner, Annoter, Partager)
 *    - Les personnes en copie peuvent (Assigner, Annoter, Partager)
 *    - Les autres peuvent (Afficher le courrier seulement)
 */
function disableRibbonButtons(){
  var ctx = new SP.ClientContext.get_current();
  var web = ctx.get_web();
    
  /** Récupération de l'ID de la liste Active et de l'ID de l'élément de liste actif */
  var listId = _spPageContextInfo.pageListId;
  var itemId = parseInt(GetUrlKeyValue('ID'));
  
  /** Utilisateur Actif */
  this.currentUser = web.get_currentUser();

  /** Récupération du courrier (l'élément de liste) */
  this.list = web.get_lists().getById(listId);
  this.listItem = list.getItemById(itemId);

  /** Actions persnnalisées utilisateur (Boutons du ruban) */
  this.userCustomActions = list.get_userCustomActions();

  ctx.load(this.currentUser);
  ctx.load(this.listItem);
  ctx.load(this.userCustomActions);
  ctx.executeQueryAsync(Function.createDelegate(this, this.onSuccess), Function.createDelegate(this, this.onFail));
}

function onSuccess(sender, args) {
    /** Destinataire du courrier */
    destinataire = this.listItem.get_item('DestinataireCourrierEntrant').$2e_1;

    /** Etat du courrier  */
    etatCourrier = this.listItem.get_item('EtatCourrier');

    /** Nom de l'utilsateur Actif */
    utilisateurConnecte = this.currentUser.get_title();

    /** Liste des actions personnalisées */
    var customActionEnumerator = userCustomActions.getEnumerator();

    /** Parcours la liste des actions personnalisées */
    while (customActionEnumerator.moveNext()) {
        /** Action personnalisée parcourur */
        var userCustomAction = customActionEnumerator.get_current();
        /** Titre de l'action personnalisée */
        customActionTitle = userCustomAction.get_title();
        
        switch(customActionTitle) {
            case 'Classer':
                /**
                 * L'action 'Classer' peut être exécutée uniquement si les conditions suivantes sont respectées :
                 *  - L'utilisateur actif est le propriétaire du courrier
                 *  - Le courrier n'est pas dans l'état 'Terminé'
                 * Si les conditions ne sont pas respectées alors l'action est désactivée
                 */
                if (destinataire != utilisateurConnecte || etatCourrier=="Terminé"){
                    $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').addClass("ms-cui-row ms-cui-disabled");

                    $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent().click(function(e){
                        e.stopImmediatePropagation();
                        $(this).addClass("ms-cui-row ms-cui-disabled");
                        return false;
                    });
                }
            break;

            case 'Assigner':
                /**
                 * L'action 'Assigner' peut être exécutée uniquement si les conditions suivantes sont respectées :
                 *  - L'utilisateur actif est le propriétaire du courrier
                 *  - L'utilisateur actif est en copie du courrier
                 *  - Le courrier n'est pas dans l'état 'Terminé'
                 * Si les conditions ne sont pas respectées alors l'action est désactivée
                 */
                if (destinataire != utilisateurConnecte || etatCourrier=="Terminé"){
                    $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').addClass("ms-cui-row ms-cui-disabled");

                    $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent().click(function(e){
                        e.stopImmediatePropagation();
                        $(this).addClass("ms-cui-row ms-cui-disabled");
                        return false;
                    });
                }
            break;

            case 'Annoter':
                /**
                 * L'action 'Annoter' peut être exécutée uniquement si les conditions suivantes sont respectées :
                 *  - L'utilisateur actif est le propriétaire du courrier
                 *  - L'utilisateur actif est en copie du courrier
                 *  - Le courrier n'est pas dans l'état 'Terminé'
                 * Si les conditions ne sont pas respectées alors l'action est désactivée
                 */
                if (destinataire != utilisateurConnecte || etatCourrier=="Terminé"){
                    $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').addClass("ms-cui-row ms-cui-disabled");

                    $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent().click(function(e){
                        e.stopImmediatePropagation();
                        $(this).addClass("ms-cui-row ms-cui-disabled");
                        return false;
                    });
                }
            break;

            case 'Partager':
                /**
                 * L'action 'Partager' peut être exécutée uniquement si les conditions suivantes sont respectées :
                 *  - L'utilisateur actif est le propriétaire du courrier
                 *  - L'utilisateur actif est en copie du courrier
                 *  - Le courrier n'est pas dans l'état 'Terminé'
                 * Si les conditions ne sont pas respectées alors l'action est désactivée
                 */
                if (destinataire != utilisateurConnecte || etatCourrier=="Terminé"){
                    $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent('a').addClass("ms-cui-row ms-cui-disabled");

                    $(".ms-cui-ctl-largelabel:contains('"+customActionTitle+"')").parent().click(function(e){
                        e.stopImmediatePropagation();
                        $(this).addClass("ms-cui-row ms-cui-disabled");
                        return false;
                    });
                }
            break;
        
            default:
                break;
        }
    }
}
function onFail(sender, args) { console.log(args.get_message()); }
//ExecuteOrDelayUntilScriptLoaded(disableRibbonButtons, "sp.ribbon.js");
_spBodyOnLoadFunctionNames.push("disableRibbonButtons");   