# 📋 Unified Kanban

Un tableau Kanban minimaliste, fluide et entièrement personnalisable sous forme d'**extension de navigateur (Chrome/Edge)**. Conçu pour gérer vos tâches quotidiennes directement depuis un panneau popup, sans jamais quitter votre onglet de travail.

Développé avec **React**, **Vite**, et propulsé par la puissance de **@dnd-kit** pour un glisser-déposer (Drag & Drop) ultra-fluide et sans bug.

---

## ✨ Fonctionnalités

*   🚀 **Accès instantané** : S'ouvre sous forme de popup d'un simple clic sur l'icône de l'extension.
*   🖱️ **Drag & Drop Moderne** : Glissez-déposez vos tâches avec précision grâce à `@dnd-kit/core` et son système d'overlay.
*   💾 **Sauvegarde locale automatique** : Toutes vos données sont sauvegardées en temps réel dans le `localStorage` de votre navigateur.
*   🏗️ **Entièrement personnalisable** :
    *   Ajoutez, renommez ou supprimez des colonnes à la volée.
    *   Créez et supprimez vos tâches en un clic.
*   🎨 **Design Épuré & Moderne** : Interface soignée s'adaptant parfaitement aux contraintes d'une popup de navigateur.

---

## 🛠️ Stack Technique

*   **Framework** : [React](https://react.dev/) (via Vite)
*   **Drag & Drop** : [@dnd-kit/core](https://dnd-kit.com/)
*   **Styles** : CSS Modules (modulaire et isolé)
*   **Extension API** : Manifest V3 (norme moderne de sécurité pour navigateurs)

---

## 📥 Installation en mode Développeur (Local)

Comme cette extension n'est pas encore publiée sur le Chrome Web Store, voici comment l'installer manuellement sur votre navigateur (Chrome, Edge, Brave, Opera, etc.) :

### 1. Cloner le projet et installer les dépendances
```bash
# Cloner le dépôt
git clone [https://github.com/votre-nom-utilisateur/UnifiedKanban.git](https://github.com/votre-nom-utilisateur/UnifiedKanban.git)
cd UnifiedKanban

# Installer les paquets (depuis votre terminal WSL/Linux ou Windows)
npm install