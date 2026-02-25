# Comptes de test Transmeet

## Données de connexion

Ces comptes sont créés par le script `seed:test-users` et respectent les politiques RLS (Row Level Security).

### Expéditeur

| Champ | Valeur |
|-------|--------|
| **Email** | `expediteur@test.transmeet.com` |
| **Mot de passe** | `TestExp2025!` |
| **Profil** | Jean Expéditeur |
| **Entreprise** | Logistique Cotonou SARL |

### Transporteur

| Champ | Valeur |
|-------|--------|
| **Email** | `transporteur@test.transmeet.com` |
| **Mot de passe** | `TestTrans2025!` |
| **Profil** | Marie Transporteur |
| **Entreprise** | Trans Afrique Express |

---

## Création des comptes

### Option 1 : Via le navigateur (recommandé)

1. Ajouter `SUPABASE_SERVICE_ROLE_KEY` dans `transmeet-app/.env.local`
2. Démarrer transmeet-app : `npm run dev`
3. Ouvrir : **http://localhost:3001/seed-test-users**
4. Cliquer sur « Créer / Réinitialiser les comptes »

### Option 2 : Via le script (Node uniquement)

```bash
cd transmeet-app
npm run seed:test-users
```

---

## Connexion

- **URL** : http://localhost:3001/login
- Utiliser les identifiants ci-dessus pour tester les dashboards expéditeur et transporteur.
