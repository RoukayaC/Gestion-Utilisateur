#!/bin/bash

echo "🚀 Démarrage de l'application User Management avec Docker..."

# Nettoyer les anciens containers/images 
echo "🧹 Nettoyage des anciens containers..."
docker-compose down -v --remove-orphans

# Construire et démarrer les services
echo "🔨 Construction et démarrage des services..."
docker-compose up --build -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 30

# Vérifier le statut
echo "📊 Statut des services:"
docker-compose ps

echo ""
echo "✅ Application démarrée avec succès!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8080"
echo "🗄️  H2 Database Console: http://localhost:8080/h2-console"
echo ""
echo "Pour arrêter l'application: docker-compose down"
echo "Pour voir les logs: docker-compose logs -f"