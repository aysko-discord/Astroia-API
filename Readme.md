# Astroia API

## Description
Astroia API est une API RESTful construite avec Node.js et Express.js pour gérer et stocker les anciens noms d'utilisateurs dans un serveur Discord. Elle utilise SQLite pour le stockage des données et fournit des points d'accès pour ajouter, récupérer et supprimer les anciens noms. L'API inclut également une fonctionnalité pour supprimer les entrées en double de la base de données.

## Prérequis
Avant de commencer, assurez-vous d'avoir satisfait aux exigences suivantes :
- Node.js installé
- Base de données SQLite configurée
- Paquets Discord.js et Axios installés (vérifiez `package.json` pour les dépendances)

## Installation
Pour installer Astroia API, suivez ces étapes :

```yml
git clone https://github.com/votre-nom-utilisateur/astroia-api.git
cd astroia-api
npm install
```

## Configuration de la Base de Données
Assurez-vous que SQLite est configuré avec un fichier de base de données nommé `astroia.db`. Sinon, modifiez la constante `DATABASE` dans `index.js` pour correspondre au nom de votre fichier de base de données.

## Utilisation
Pour démarrer le serveur API, exécutez la commande suivante :

```js
node index.js
```

L'API sera accessible à l'adresse `http://localhost:PORT` (remplacez `PORT` par le numéro de port spécifié dans le fichier `config.js`).

## Points d'Accès

### `POST /oldnames`
Ajoutez l'ancien nom d'un utilisateur à la base de données.

#### Corps de la Requête
```json
{
  "user_id": "123456789012345678",
  "old_name": "AncienPseudo"
}
```

# POST /clearprevname

Supprimez les anciens noms d'un utilisateur de la base de données.

Corps de la Requête

```js
{
  "user_id": "123456789012345678"
}
```

 # GET /prevnamecount

Obtenez le nombre total d'anciens noms stockés dans la base de données.

GET /prevnames/:user_id
Obtenez une liste des anciens noms pour un utilisateur spécifique.


# Paramètres


user_id (chaîne de caractères) : ID Discord de l'utilisateur.

# GET /status

Vérifiez l'état du serveur API.


# Contribution
N'hésitez pas à contribuer à ce projet en rejoignant le serveur Discord d'Astroia : https://discord.gg/astroia.

# Licence
Ce projet est sous licence [MIT License.](https://discord.gg/astroia)