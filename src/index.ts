import getStatsCourrier from "./affichages/courrier-stats"
import organizeCourrierFields from "./affichages/organize-courrier-fields"
import disableRibbonActions_envoyes from "./actions/disableRibbonActions.envoye"
import disableRibbonActions_recus from "./actions/disableRibbonActions.recu"
import hideSPRibbonActions from "./actions/hideSPRibbonActions"
import organizeCourrierTasksFields from "./affichages/organize-courrier-taskfields"
import uploadcourrierButtons from "./boutons/uploadcourriers"
import classerCourrier from "./actions/classercourrier"
import classerCourrierSortant from "./actions/classercourriersortant"

this.getStatsCourrier               = getStatsCourrier;
this.organizeCourrierFields         = organizeCourrierFields;
this.hideSPRibbonActions            = hideSPRibbonActions;
this.disableRibbonActions_envoyes   = disableRibbonActions_envoyes;
this.disableRibbonActions_recus     = disableRibbonActions_recus;
this.organizeCourrierTasksFields    = organizeCourrierTasksFields;
this.uploadcourrierButtons          = uploadcourrierButtons;
this.classerCourrier                = classerCourrier;
this.classerCourrierSortant         = classerCourrierSortant;