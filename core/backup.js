/**
 * LifeOS - Backup Service (Sèvis Sovgard ak Restorasyon)
 * Fichye sa a jere ekspòtasyon done store la an fòma JSON ak enpòtasyon yo ak validasyon sekirite.
 */

import { store } from "./store.js";

export const backupService = {
  /**
   * Ekspòte tout done ki nan store la epi deklanche yon telechajman otomatik nan navigatè a
   */
  exportBackup() {
    try {
      const currentState = store.getState();
      
      // Kreye objè sovgard la ak metadata enpòtan
      const backupData = {
        meta: {
          exportedAt: new Date().toISOString(),
          version: currentState.meta?.version || "1.0.0",
          app: "LifeOS"
        },
        data: { ...currentState }
      };

      // Konvèti objè a an string JSON byen fòmate
      const jsonString = JSON.stringify(backupData, null, 2);
      
      // Kreye yon Blob ak done JSON yo
      const blob = new Blob([jsonString], { type: "application/json" });
      
      // Jenere yon non fichye ak dat jounen jodi a (Format: YYYY-MM-DD)
      const today = new Date().toISOString().split("T")[0];
      const fileName = `lifeos-backup-${today}.json`;

      // Kreye yon eleman <a> envizib nan DOM lan pou deklanche download la
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      
      // Ajoute l nan dokiman an, klike sou li, epi retire l lamenm
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Libere memwa URL blob la te pran an
      URL.revokeObjectURL(link.href);
      
      console.log(`[Backup] Done yo ekspòte avèk siksè nan fichye: ${fileName}`);
    } catch (error) {
      console.error("[Backup Erè] Ekspòtasyon an echwe:", error);
      throw new Error("Echèk pandan ekspòtasyon done yo.");
    }
  },

  /**
   * Li yon fichye JSON itilizatè a chwazi, valide estrikti l, epi chaje done yo nan store la
   * @param {File} file - Objè fichye File ki soti nan yon input type="file"
   * @returns {Promise<boolean>} Retounen true si restorasyon an fèt byen
   */
  importBackup(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("Pa gen okenn fichye ki chwazi."));
        return;
      }

      const reader = new FileReader();

      // Lè navigatè a fini li kontni fichye a
      reader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target.result);

          // 1. Validasyon fondamantal sou estrikti sovgard la
          if (!parsedData || typeof parsedData !== "object" || !parsedData.data) {
            throw new Error("Estrikti fichye a envalid. Li pa koresponn ak yon sovgard LifeOS.");
          }

          const stateToImport = parsedData.data;

          // 2. Validasyon sekirite: Tcheke si kle kritik yo egziste pou evite kase UI a apre enpòtasyon
          const hasMissions = "missions" in stateToImport && Array.isArray(stateToImport.missions);
          const hasSavings = "savings" in stateToImport && typeof stateToImport.savings === "object";
          const hasInternet = "internetPlan" in stateToImport && typeof stateToImport.internetPlan === "object";

          if (!hasMissions || !hasSavings || !hasInternet) {
            throw new Error("Done yo koronpi oswa yo manke seksyon esansyèl (missions, savings, internetPlan).");
          }

          // 3. Si tout chèk yo pase, nou chaje tout done yo nèt nan store la
          store.setState(stateToImport);
          
          console.log("[Backup] Done yo enpòte ak restore avèk siksè nan store la.");
          resolve(true);
        } catch (error) {
          console.error("[Backup Erè] Enpòtasyon an echwe:", error.message);
          // Nou jete erè a san li pa kraze rès aplikasyon an gras ak pwomès la
          reject(new Error(`Fichye envalid: ${error.message}`));
        }
      };

      // Si gen yon erè teknik nan lekti fichye a sou disk la
      reader.onerror = () => {
        console.error("[Backup Erè] Lekti fichye a sou sistèm lan echwe.");
        reject(new Error("Erè teknik pandan lekti fichye a sou òdinatè w."));
      };

      // Kòmanse li fichye a kòm tèks UTF-8
      reader.readAsText(file);
    });
  }
};

/**
 * Ekspòtasyon fonksyon endividyèl yo pou fasilite enpòtasyon dirèk nan lòt modil yo
 */
export const { exportBackup, importBackup } = backupService;
