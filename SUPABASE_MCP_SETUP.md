# 🚀 Configuration du MCP Supabase

## ✅ Installation terminée

Le serveur MCP officiel de Supabase (`@supabase/mcp-server-supabase`) a été installé avec succès !

## 🎯 Qu'est-ce que le MCP Supabase ?

Le **Model Context Protocol (MCP) de Supabase** vous permet de :
- ✅ Exécuter des requêtes SQL directement depuis Claude Desktop/Cursor
- ✅ Gérer vos tables sans aller sur le dashboard Supabase
- ✅ Créer/modifier des tables avec de simples commandes
- ✅ Insérer/modifier des données facilement
- ✅ **Plus besoin de scripts SQL manuels !**

## 🔧 Configuration pour Claude Desktop

### 1. Récupérer votre Service Role Key

1. Allez sur [Supabase Dashboard → Settings → API](https://supabase.com/dashboard/project/lqewrvxuiuvkwpspbjtt/settings/api)
2. Copiez la clé **`service_role`** (⚠️ **PAS** la clé `anon`)

### 2. Configurer Claude Desktop

Ouvrez le fichier de configuration de Claude Desktop :

**macOS** :
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Ajoutez cette configuration** :
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["@supabase/mcp-server-supabase"],
      "env": {
        "SUPABASE_URL": "https://lqewrvxuiuvkwpspbjtt.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "VOTRE_SERVICE_ROLE_KEY_ICI"
      }
    }
  }
}
```

⚠️ **Remplacez** `VOTRE_SERVICE_ROLE_KEY_ICI` par votre vraie clé !

### 3. Redémarrer Claude Desktop

Fermez et relancez Claude Desktop pour charger la configuration.

## 🎯 Utilisation dans Claude Desktop

Une fois configuré, vous pourrez demander à Claude :

### Exemples de commandes

```
"Liste toutes mes tables Supabase"

"Crée une table 'comments' avec les colonnes id, gallery_id, author, content, created_at"

"Affiche les 10 dernières galeries créées"

"Ajoute une colonne 'description' à la table galleries"

"Insère une galerie de test dans la base de données"

"Montre-moi le schéma complet de la table photos"

"Supprime toutes les galeries expirées"
```

## 🔧 Configuration pour Cursor/Windsurf

Si vous utilisez Cursor ou Windsurf :

**Cursor** :
```bash
code ~/.cursor/mcp_config.json
```

**Windsurf** :
```bash
code ~/.windsurf/mcp_config.json
```

Utilisez la même configuration JSON que pour Claude Desktop.

## 🎉 Avantages du MCP

### Avant (sans MCP) :
1. ❌ Éditer `supabase-schema.sql`
2. ❌ Copier le SQL
3. ❌ Ouvrir le dashboard Supabase
4. ❌ Coller dans SQL Editor
5. ❌ Exécuter manuellement

### Maintenant (avec MCP) :
1. ✅ Demander à Claude : "Ajoute une colonne X à la table Y"
2. ✅ **C'est tout !** 🎉

## 🔐 Sécurité

- ⚠️ **JAMAIS** committer votre `claude_desktop_config.json` avec la Service Role Key
- La Service Role Key a **tous les privilèges** - gardez-la secrète
- Elle est stockée localement sur votre Mac uniquement

## 🧪 Test

Pour tester que ça fonctionne, ouvrez Claude Desktop et demandez :

```
"Liste toutes mes tables Supabase et montre-moi leur structure"
```

Claude devrait vous afficher vos tables : `galleries`, `photos`, `gallery_categories`, etc.

## 📚 Ressources

- [Documentation MCP Supabase](https://github.com/supabase/mcp-server-supabase)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Supabase Dashboard](https://supabase.com/dashboard/project/lqewrvxuiuvkwpspbjtt)

---

**Prochaines étapes** :
1. Récupérer votre Service Role Key
2. Configurer Claude Desktop avec le JSON ci-dessus
3. Redémarrer Claude Desktop
4. Tester en demandant à Claude de lister vos tables ! 🚀
