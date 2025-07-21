import React from 'react';
import { useUser } from '../hooks/useUser';

const AdminDashboard: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-red-500">Accès non autorisé</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Veuillez vous connecter pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Tableau de bord Admin</h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Bienvenue, {user.username} !</p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Statistiques et Outils</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Cette section est en cours de développement. Prochainement, vous pourrez y trouver :
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-slate-600 dark:text-slate-300">
          <li>Statistiques de consultation du dictionnaire.</li>
          <li>Statistiques d'utilisation des jeux.</li>
          <li>Outils de gestion de contenu pour le dictionnaire et les quiz.</li>
          <li>Gestion des retours utilisateurs.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
