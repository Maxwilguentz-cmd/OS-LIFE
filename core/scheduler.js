/**
 * LifeOS - Scheduler (Kwonotach ak Chèk Otomatik)
 * Fichye sa a verifye eta aplikasyon an regilyèman pou dekouvri alèt ak travay ki an reta.
 */

import { notify } from "./notify.js";

export const scheduler = {
  /**
   * Kouri tout chèk otomatik yo sou eta aplikasyon an
   * @param {Object} state - Eta aktyèl store la
   */
  runAutomaticChecks(state) {
    if (!state) {
      console.warn("[Scheduler] Pa gen okenn 'state' ki disponib pou chèk yo.");
      return;
    }

    console.log("[Scheduler] Chèk otomatik yo ap kouri...");

    this._checkInternetExpiration(state.internetPlan);
    this._checkOverdueMissions(state.missions);
  },

  /**
   * Tcheke si plan entènèt la ap ekspire nan mwens pase 3 jou (72 èdtan)
   * @param {Object} internetPlan - Done plan entènèt la nan state la
   * @private
   */
  _checkInternetExpiration(internetPlan) {
    if (!internetPlan || !internetPlan.isActive || !internetPlan.expirationDate) {
      return;
    }

    const expirationTime = new Date(internetPlan.expirationDate).getTime();
    const currentTime = Date.now();
    
    // Diferans an milisgond
    const timeDifference = expirationTime - currentTime;
    
    // Konvèti milisgond an jou
    const daysRemaining = timeDifference / (1000 * 60 * 60 * 24);

    // Si plan an aktif epi li rete mwens pase 3 jou (men li poko pase)
    if (daysRemaining > 0 && daysRemaining <= 3) {
      const hoursRemaining = Math.round(daysRemaining * 24);
      const message = `Plan entènèt ou an (${internetPlan.provider}) ap ekspire nan apeprè ${hoursRemaining} èdtan!`;
      
      console.warn(`[Scheduler - Alèt Entènèt]: ${message}`);
      
      notify.send("Alèt Ekspirasyon Entènèt", {
        body: message,
        tag: "internet-expiration"
      });
    }
  },

  /**
   * Tcheke si gen misyon ki poko fèt epi ki depase lè limit yo pou jounen an
   * @param {Array} missions - Lis misyon ki nan state la
   * @private
   */
  _checkOverdueMissions(missions) {
    if (!Array.isArray(missions) || missions.length === 0) {
      return;
    }

    const currentTime = new Date();
    let overdueCount = 0;

    missions.forEach(mission => {
      // KOREKSYON: Nou tcheke mission.done (pa mission.completed) pou matche ak estrikti ofisyèl la
      if (!mission.done && mission.dueTime) {
        const [hours, minutes] = mission.dueTime.split(":").map(Number);
        
        const missionDueTime = new Date();
        missionDueTime.setHours(hours, minutes, 0, 0);

        // Si lè aktyèl la depase lè limit misyon an pou jodi a
        if (currentTime > missionDueTime) {
          overdueCount++;
        }
      }
    });

    if (overdueCount > 0) {
      const message = `Ou gen ${overdueCount} misyon ki an reta pou jodi a. Tanpri tcheke yo!`;
      
      console.warn(`[Scheduler - Alèt Misyon]: ${message}`);
      
      notify.send("Misyon an Reta", {
        body: message,
        tag: "overdue-missions"
      });
    }
  }
};

/**
 * Ekspòte fonksyon prensipal la dirèkteman pou matche demand lan
 */
export function runAutomaticChecks(state) {
  scheduler.runAutomaticChecks(state);
}
