(function () {

    const UT4_STATS = {
        playerStats: {},
        victimByKillerAndWeapon: {}
    };

    fetchServerData()
        .then(() => refreshTable(UT4_STATS));

    function fetchServerData(pageNumber) {
        if (!pageNumber) {
            pageNumber = 1;
        }

        let shouldContinue = true;

        return fetch(`https://ut4_stats.apispark.net/v1/kills/?$page=${pageNumber}&$size=10000`)
            .then(response => {
                return response.json();
            })
            .then(kills => {
                kills.forEach(kill => {
                    getStat(kill.killer).kills += 1;
                    getStat(kill.victim).deaths += 1;
                    addVictimKilledByKillerAndWeapon(kill.victim, kill.killer, kill.weapon);

                });
                //console.log(UT4_STATS);
                //debugger;
                return fetchServerData(pageNumber + 1);

            })
            .catch(error => console.log(error));
    }

    function getStat(playerName) {
        if (!UT4_STATS.playerStats[playerName]) {
            UT4_STATS.playerStats[playerName] = {
                kills: 0,
                suicide: 0,
                spawnIntrusion: 0,
                hotPotato: 0,
                deaths: 0
            };
        }
        return UT4_STATS.playerStats[playerName];
    }

    function addVictimKilledByKillerAndWeapon(victim, killer, weapon) {
        if (!UT4_STATS.victimByKillerAndWeapon[killer]) {
            UT4_STATS.victimByKillerAndWeapon[killer] = {};
        }
        if (!UT4_STATS.victimByKillerAndWeapon[killer][weapon]) {
            UT4_STATS.victimByKillerAndWeapon[killer][weapon] = {};
        }
        if (!UT4_STATS.victimByKillerAndWeapon[killer][weapon][victim]) {
            UT4_STATS.victimByKillerAndWeapon[killer][weapon][victim] = 0;
        }
        UT4_STATS.victimByKillerAndWeapon[killer][weapon][victim] += 1;
    }

})();

