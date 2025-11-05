const fs = require('fs');
const path = require('path');

function extractUniqueCitiesFromMG() {
    try {
        // Lire le fichier MG.txt
        const filePath = path.join(__dirname, 'MG.txt');
        const data = fs.readFileSync(filePath, 'utf8');

        // Diviser par lignes
        const lines = data.split('\n').filter(line => line.trim() !== '');

        // Utiliser un Set pour éviter les doublons sur le nom de la ville (insensible à la casse)
        const seenCities = new Set();
        const jsonData = [];

        lines.forEach(line => {
            const fields = line.split('\t');
            const name = fields[1] ? fields[1].trim() : '';
            const latitude = fields[4];
            const longitude = fields[5];

            // Vérifie que les champs essentiels existent
            if (
                name &&
                !seenCities.has(name.toLowerCase()) &&
                latitude !== undefined &&
                longitude !== undefined &&
                !isNaN(parseFloat(latitude)) &&
                !isNaN(parseFloat(longitude))
            ) {
                jsonData.push({
                    city: name,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                });
                seenCities.add(name.toLowerCase());
            }
        });

        // Sauvegarder en fichier JSON
        const outputPath = path.join(__dirname, 'MG_cities_unique.json');
        fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));

        console.log(`✅ Extraction terminée! ${jsonData.length} villes uniques extraites.`);
        console.log(`📁 Fichier sauvegardé: ${outputPath}`);

        // Afficher les premières entrées pour vérification
        console.log('\n📋 Aperçu des premières entrées:');
        console.log(JSON.stringify(jsonData.slice(0, 3), null, 2));

        return jsonData;

    } catch (error) {
        console.error('❌ Erreur lors de l\'extraction:', error.message);
        return null;
    }
}

// Exécution du script
console.log('🚀 Début de l\'extraction des villes uniques de MG.txt...\n');
extractUniqueCitiesFromMG();

module.exports = {
    extractUniqueCitiesFromMG
};