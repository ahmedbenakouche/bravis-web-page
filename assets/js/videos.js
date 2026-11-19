/* Every video of the site, in one place.
   To fill a slot: drop the .mp4 named `file` into assets/videos/.
   Optional preview image: same name with .jpg (e.g. doc-save.jpg). */
window.BRAVIS_VIDEO_CATEGORIES = [
  { id: "start", fr: "Débuter", en: "Getting started" },
  { id: "versions", fr: "Versions", en: "Versions" },
  { id: "collab", fr: "Collaboration", en: "Collaboration" },
  { id: "tasks", fr: "Tâches et reviews", en: "Tasks & reviews" }
];

window.BRAVIS_VIDEOS = [
  {
    id: "presentation", file: "presentation.mp4", cat: "start", section: "",
    fr: { title: "BRAVIS en 2 minutes", desc: "Vue d’ensemble : un projet partagé, des versions, une review." },
    en: { title: "BRAVIS in 2 minutes", desc: "Overview: a shared project, versions, a review." },
    hint: { fr: "1 à 2 min : Connect, Open, Save, Share, Version tree, Merge Compare.", en: "1–2 min: Connect, Open, Save, Share, Version tree, Merge Compare." }
  },
  {
    id: "installation", file: "doc-installation.mp4", cat: "start", section: "installation",
    fr: { title: "Installer et charger l’extension", desc: "Ajouter le module à 3D Slicer et vérifier Git / GitHub CLI." },
    en: { title: "Install and load the extension", desc: "Add the module to 3D Slicer and check Git / GitHub CLI." },
    hint: { fr: "Download ZIP → Additional module paths → pip_install xxhash → redémarrage → Informatics → BRAVIS.", en: "Download ZIP → Additional module paths → pip_install xxhash → restart → Informatics → BRAVIS." }
  },
  {
    id: "connexion", file: "doc-connexion.mp4", cat: "start", section: "connexion",
    fr: { title: "Se connecter à GitHub", desc: "Connect with GitHub, code à usage unique, I have signed in." },
    en: { title: "Connect to GitHub", desc: "Connect with GitHub, one-time code, I have signed in." },
    hint: { fr: "Connect with GitHub → Open sign-in → Yes → code → navigateur → I have signed in (+ Continue optionnel).", en: "Connect with GitHub → Open sign-in → Yes → code → browser → I have signed in (+ optional Continue)." }
  },
  {
    id: "projet", file: "doc-projet.mp4", cat: "start", section: "projet",
    fr: { title: "Créer ou ouvrir un projet", desc: "Create (nom + description) puis Open d’un projet existant." },
    en: { title: "Create or open a project", desc: "Create (name + description), then Open an existing project." },
    hint: { fr: "Volume + Ontology → Create → New project → Open d’un projet existant.", en: "Volume + Ontology → Create → New project → Open an existing project." }
  },
  {
    id: "ontologie", file: "doc-ontologie.mp4", cat: "start", section: "ontologie",
    fr: { title: "Éditer une ontologie", desc: "Load JSON, Edit (Add root, Add child, Rename), Export JSON." },
    en: { title: "Edit an ontology", desc: "Load JSON, Edit (Add root, Add child, Rename), Export JSON." },
    hint: { fr: "Ontology map → ⚙ → Edit… (Add child / Rename / Apply) → Export JSON…", en: "Ontology map → ⚙ → Edit… (Add child / Rename / Apply) → Export JSON…" }
  },
  {
    id: "anatomie", file: "doc-anatomie.mp4", cat: "start", section: "anatomie",
    fr: { title: "Naviguer dans l’arbre anatomique", desc: "Déplier les structures, lire les pastilles d’annotation." },
    en: { title: "Browse the anatomy tree", desc: "Expand structures, read the annotation marks." },
    hint: { fr: "View anatomy tree, clic pour déplier, double-clic pour les détails, bouton ? et Collapse all.", en: "View anatomy tree, click to expand, double-click for details, ? button and Collapse all." }
  },
  {
    id: "version-tree", file: "doc-version-tree.mp4", cat: "versions", section: "version-tree",
    fr: { title: "Explorer le Version tree", desc: "Zoom, déplacement, détails d’une version, légende." },
    en: { title: "Explore the Version tree", desc: "Zoom, pan, version details, legend." },
    hint: { fr: "View version tree, molette pour zoomer, glisser, double-clic sur un nœud → Version details.", en: "View version tree, wheel to zoom, drag, double-click a node → Version details." }
  },
  {
    id: "switch", file: "doc-switch.mp4", cat: "versions", section: "switch",
    fr: { title: "Changer de version (Switch)", desc: "Charger une ancienne version dans Slicer." },
    en: { title: "Switch version", desc: "Load an older version in Slicer." },
    hint: { fr: "Clic sur un nœud → Switch version → la segmentation change dans les vues.", en: "Click a node → Switch version → the segmentation changes in the views." }
  },
  {
    id: "save", file: "doc-save.mp4", cat: "versions", section: "save",
    fr: { title: "Enregistrer une version (Save)", desc: "Les choix Put on main, Save on this branch, Create a branch." },
    en: { title: "Save a version", desc: "The Put on main, Save on this branch, Create a branch choices." },
    hint: { fr: "Annoter quelques coupes → Save → message → nouveau nœud en pointillés dans le tree.", en: "Annotate a few slices → Save → message → new dashed node in the tree." }
  },
  {
    id: "branches", file: "doc-branches.mp4", cat: "versions", section: "branches",
    fr: { title: "Créer une branche et une sous-branche", desc: "sos → sos/ok → sos/ok/yoi." },
    en: { title: "Create a branch and a sub-branch", desc: "sos → sos/ok → sos/ok/yoi." },
    hint: { fr: "Save → Create a branch → nom court ; puis depuis cette branche, nouvelle sous-branche.", en: "Save → Create a branch → short name; then a sub-branch from that branch." }
  },
  {
    id: "share", file: "doc-share.mp4", cat: "versions", section: "share",
    fr: { title: "Publier ses versions (Share)", desc: "Les pointillés deviennent pleins." },
    en: { title: "Publish your versions (Share)", desc: "Dashed nodes become solid." },
    hint: { fr: "Share → confirmation (branche, tip) → les nœuds passent de pointillés à plein.", en: "Share → confirmation (branch, tip) → nodes turn from dashed to solid." }
  },
  {
    id: "compare-shared", file: "compare-with-shared.mp4", cat: "versions", section: "compare-shared",
    fr: { title: "Compare with shared", desc: "Local en retard : Update, Reset to shared ou Compare and merge, puis Validate." },
    en: { title: "Compare with shared", desc: "Local is behind: Update, Reset to shared or Compare and merge, then Validate." },
    hint: { fr: "Cloche ⚠ → Compare with shared → Update / Reset / Compare and merge → Validate.", en: "Bell ⚠ → Compare with shared → Update / Reset / Compare and merge → Validate." }
  },
  {
    id: "merge-compare", file: "merge-compare.mp4", cat: "versions", section: "merge",
    fr: { title: "Merge → Compare : vues synchronisées", desc: "Comparer deux versions côte à côte avant de fusionner." },
    en: { title: "Merge → Compare: synchronized views", desc: "Compare two versions side by side before merging." },
    hint: { fr: "", en: "" }
  },
  {
    id: "apply-merge", file: "doc-apply-merge.mp4", cat: "versions", section: "merge",
    fr: { title: "Choisir les cubes et appliquer le merge", desc: "Prev / Next, cubes cyan, Apply merge." },
    en: { title: "Pick cubes and apply the merge", desc: "Prev / Next, cyan cubes, Apply merge." },
    hint: { fr: "Parcourir les segments, cliquer les cubes à garder (cyan), Apply merge, nœud de merge dans le tree.", en: "Go through segments, click the cubes to keep (cyan), Apply merge, merge node in the tree." }
  },
  {
    id: "people", file: "doc-people.mp4", cat: "collab", section: "people",
    fr: { title: "Inviter un collègue (People)", desc: "Ajouter un senior ou un junior, puis Join côté invité." },
    en: { title: "Invite a colleague (People)", desc: "Add a senior or a junior, then Join on the guest side." },
    hint: { fr: "People → nom GitHub → rôle → Add ; côté invité : cloche → invitation → Join.", en: "People → GitHub username → role → Add; guest side: bell → invitation → Join." }
  },
  {
    id: "tasks-assign", file: "doc-tasks-assign.mp4", cat: "tasks", section: "tasks-assign",
    fr: { title: "Assigner une tâche (senior)", desc: "Description, juniors, version de départ, nom de branche." },
    en: { title: "Assign a task (senior)", desc: "Description, juniors, start version, branch name." },
    hint: { fr: "Tasks → description → cocher les juniors → Choose on tree → Assign → nom de branche.", en: "Tasks → description → tick juniors → Choose on tree → Assign → branch name." }
  },
  {
    id: "tasks-junior", file: "doc-tasks-junior.mp4", cat: "tasks", section: "tasks-junior",
    fr: { title: "Travailler sur sa tâche (junior)", desc: "Save, Share, puis Request review." },
    en: { title: "Work on your task (junior)", desc: "Save, Share, then Request review." },
    hint: { fr: "Switch sur la branche de tâche → annoter → Save → Share → détails du tip → Request review.", en: "Switch to the task branch → annotate → Save → Share → tip details → Request review." }
  },
  {
    id: "tasks-review", file: "doc-tasks-review.mp4", cat: "tasks", section: "tasks-review",
    fr: { title: "Accepter ou refuser une review (senior)", desc: "Accept and Merge ou Decline sur le nœud 🔵." },
    en: { title: "Accept or decline a review (senior)", desc: "Accept and Merge or Decline on the 🔵 node." },
    hint: { fr: "Notification → nœud 🔵 → Accept and Merge → Compare and Merge → Apply merge → tâche ✅.", en: "Notification → 🔵 node → Accept and Merge → Compare and Merge → Apply merge → task ✅." }
  },
  {
    id: "messages", file: "doc-messages.mp4", cat: "collab", section: "messages",
    fr: { title: "Messages, cloche et fil d’activité", desc: "Échanger avec l’équipe et suivre l’activité du projet." },
    en: { title: "Messages, bell and activity feed", desc: "Talk with the team and follow project activity." },
    hint: { fr: "Ouvrir Messages, envoyer un message ; ouvrir la cloche, lire une notification, Mark all as read.", en: "Open Messages, send a message; open the bell, read a notification, Mark all as read." }
  },
  {
    id: "delete", file: "doc-delete.mp4", cat: "collab", section: "delete",
    fr: { title: "Supprimer une version locale ou un projet", desc: "Delete sur un nœud en pointillés ; Delete project (local ou GitHub)." },
    en: { title: "Delete a local version or a project", desc: "Delete on a dashed node; Delete project (local or GitHub)." },
    hint: { fr: "Nœud en pointillés → Delete ; panneau Delete → This computer only ou GitHub and this computer (owner).", en: "Dashed node → Delete; panel Delete → This computer only or GitHub and this computer (owner)." }
  },
  {
    id: "scenario", file: "doc-scenario.mp4", cat: "tasks", section: "scenarios",
    fr: { title: "Scénario complet senior + junior", desc: "De la création du projet à la tâche acceptée." },
    en: { title: "Full senior + junior scenario", desc: "From project creation to the accepted task." },
    hint: { fr: "Deux écrans ou montage : Create, invitation, Assign, travail du junior, review, Accept.", en: "Two screens or an edit: Create, invitation, Assign, junior work, review, Accept." }
  }
];
