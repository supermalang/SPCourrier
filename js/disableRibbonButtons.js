/**
 * Désactive les boutons d'actions personnalisés selon les informations du courrier
 * Exigences fontionnelles 
 *    - Le destinataire du courrier peut (Terminer, Affecter, Annoter, Transmettre)
 *    - Les personnes en copie peuvent (Affecter, Annoter, Transmettre)
 *    - Les autres peuvent (Afficher le courrier seulement)
 */
function disableRibbonButtons(){
  var ctx = new SP.ClientContext.get_current();
  var web = ctx.get_web();
  
  // On récupère l'ID de la liste et l'ID de l'élément de liste Actif
  var listId = _spPageContextInfo.pageListId;
  var itemId = parseInt(GetUrlKeyValue('ID'));
  
  // Utilisateur connecté
  this.currentUser = web.get_currentUser();

  // On récupère le courrier (l'élément de liste)
  this.list = web.get_lists().getById(listId);
  this.listItem = list.getItemById(itemId);

  // Actions personnalisées des utilisateurs
  this.userCustomActions = list.get_userCustomActions();

  ctx.load(this.currentUser);
  ctx.load(this.listItem);
  ctx.load(this.userCustomActions);
  ctx.executeQueryAsync(Function.createDelegate(this, this.onSuccess), Function.createDelegate(this, this.onFail));
  }

  function onSuccess(sender, args) {
    // Nom du destinataire du courrier
    destinataire = this.listItem.get_item('DestinataireCourrierEntrant').$2e_1;

    // Nom de l'utilsateur Actif
    utilisateurConnecte = this.currentUser.get_title();
    
    var customActionEnumerator = userCustomActions.getEnumerator();
    while (customActionEnumerator.moveNext()) {
        var userCustomAction = customActionEnumerator.get_current();
        customActionTitle = userCustomAction.get_title();
        // Si le courrier n'est pas destiné à l'utilisateur connecté
        
        switch(customActionTitle) {
            case 'Terminer':
            console.log("Terminer");
                if (destinataire != utilisateurConnecte){
                    // On désactive le bouton Terminer
                    $(".ms-cui-ctl-largelabel:contains('Terminer')").parent().click(function(e){
                        e.stopImmediatePropagation();
                        $(this).addClass("ms-cui-row ms-cui-disabled");
                        return false;
                    });
                    $(".ms-cui-ctl-largelabel:contains('Terminer')").parent().addClass("ms-cui-row ms-cui-disabled");
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