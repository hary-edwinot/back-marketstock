const { DataTypes } = require('sequelize');
const path = require('path');

module.exports = (db_connection) => {
    const Ville = db_connection.define('Ville', {
        ville_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        ville_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        ville_lat: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false
        },
        ville_long: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false
        }
        // champs supprimés : ville_admin_name, ville_country
    }, {
        tableName: 'Villes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true,
        deletedAt: 'deleted_at'
    });

    Ville.afterSync(async () => {
        try {
            console.log('🏙️ Hook afterSync déclenché pour Ville - Vérification des villes par défaut...');

            const count = await Ville.count();
            if (count > 0) {
                console.log(`✅ ${count} villes déjà présentes dans la base.`);
                return;
            }

            let cityData;
            try {
                const jsonPath = path.join(__dirname, '../files/MG_cities_unique.json');
                console.log('📂 Tentative de chargement depuis:', jsonPath);
                cityData = require(jsonPath);
            } catch (requireError) {
                console.log('❌ Première tentative échouée, essai avec chemin relatif...');
                try {
                    cityData = require('../files/MG_cities_unique.json');
                } catch (secondError) {
                    console.error('❌ Impossible de charger MG_cities_unique.json:', secondError.message);
                    console.log('📁 Vérifiez que le fichier existe dans app/files/MG_cities_unique.json');
                    return;
                }
            }
            
            if (!cityData || !Array.isArray(cityData)) {
                console.log('❌ Fichier MG_cities_unique.json non trouvé ou invalide');
                return;
            }

            console.log(`📊 ${cityData.length} entrées trouvées dans MG_cities_unique.json`);

            // Correction ici : adapter à la structure de ton JSON
            const validCities = cityData.filter(city => 
                city &&
                city.city &&
                typeof city.city === 'string' &&
                city.city.trim() !== '' &&
                city.latitude !== undefined &&
                city.longitude !== undefined &&
                !isNaN(parseFloat(city.latitude)) &&
                !isNaN(parseFloat(city.longitude))
            );

            const uniqueCities = validCities.filter((city, index, self) => {
                return index === self.findIndex(c =>
                    c.city.toLowerCase().trim() === city.city.toLowerCase().trim()
                );
            });

            console.log(`🔄 ${validCities.length} villes valides → ${uniqueCities.length} villes uniques`);

            if (uniqueCities.length === 0) {
                console.log('❌ Aucune ville valide trouvée pour l\'insertion');
                return;
            }

            const defaultVilles = uniqueCities.map(city => ({
                ville_name: city.city.trim(),
                ville_lat: parseFloat(city.latitude),
                ville_long: parseFloat(city.longitude)
            }));

            await Ville.bulkCreate(defaultVilles, { 
                ignoreDuplicates: true,
                validate: true 
            });

            console.log('✅ Villes par défaut insérées dans la table Villes');
            
            const finalCount = await Ville.count();
            console.log(`📊 Total dans la base: ${finalCount} villes`);

        } catch (error) {
            console.error('❌ Erreur lors de l\'insertion des villes par défaut:', error.message);
        }
    });

    Ville.forceInsertData = async () => {
        try {
            console.log('🔄 Insertion forcée des données de villes...');
            await Ville.destroy({ where: {}, force: true });
            await Ville.afterSync();
        } catch (error) {
            console.error('❌ Erreur lors de l\'insertion forcée:', error);
        }
    };

    Ville.associate = models => {
        // Association avec d'autres modèles si nécessaire
    };

    return Ville;
};