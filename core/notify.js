/**
 * LifeOS - Notification Service
 * Jere notifikasyon nan navigatè a ak pèmisyon yo.
 * Li fèt pou li pa janm plante aplikasyon an si navigatè a pa sipòte API sa a.
 */

export const notify = {
  /**
   * Tcheke si navigatè a sipòte Notification API
   * @returns {boolean}
   */
  isSupported() {
    return typeof window !== "undefined" && "Notification" in window;
  },

  /**
   * Mande pèmisyon itilizatè a pou montre notifikasyon
   * @returns {Promise<string>} Status pèmisyon an ("granted", "denied", "default")
   */
  async requestBrowserPermission() {
    if (!this.isSupported()) {
      console.warn("Notifikasyon yo pa sipòte sou navigatè sa a.");
      return "denied";
    }

    try {
      // Gen kèk ansyen navigatè ki itilize callback olye de Promise, nou sekirize sa
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("Erè lè n ap mande pèmisyon notifikasyon:", error);
      return "default";
    }
  },

  /**
   * Voye yon notifikasyon sistèm si nou gen pèmisyon
   * @param {string} title - Tit notifikasyon an
   * @param {Object} options - Opsyon adisyonèl (body, icon, elatriye)
   */
  send(title, options = {}) {
    if (!this.isSupported()) {
      console.log(`[Notification Fallback]: ${title} - ${options.body || ""}`);
      return;
    }

    if (Notification.permission === "granted") {
      try {
        new Notification(title, {
          icon: "/assets/icons/favicon.png", // Chemen default pou icon
          ...options
        });
      } catch (error) {
        console.error("Erè lè n ap voye notifikasyon an:", error);
      }
    } else {
      // Si nou pa gen pèmisyon, nou voye l nan console la kòm sekirite
      console.log(`[Notification (Pa gen pèmisyon)]: ${title} - ${options.body || ""}`);
    }
  }
};
