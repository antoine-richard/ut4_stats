(function () {

    const WORLD = "<world>"
    const UT4_STATS = {}

    google.charts.load('current', { 'packages': ['corechart'] });
    fetchServerData()
        .then(() => objectToOrderedTable(UT4_STATS.worstJumper, '#worstJumper'))
        .then(() => objectToOrderedTable(UT4_STATS.hotPotato, '#hotPotato'))
        .then(() => objectToOrderedTable(UT4_STATS.spawnIntruder, '#spawnIntruder'))
        .then(() => objectToOrderedTable(UT4_STATS.worstSwimmer, '#worstSwimmer'))
        .then(() => {
            _.forEach(UT4_STATS.killDistributionByKillerAndWeapon, (distribution, killer) => {
                distribution.unshift(['Weapon', 'Count']);
                var data = google.visualization.arrayToDataTable(distribution);
                var options = {
                    title: `${killer}'s favorite gun`
                };

                var div = document.createElement('div');
                div.id = killer;
                document.querySelector('section.content').appendChild(div);

                new google.visualization.PieChart(document.getElementById(killer)).draw(data, options);

            });
        });


    function fetchServerData() {
        let shouldContinue = true;

        return fetch(`http://89.90.86.195/api/stats`)
            .then(response => {
                return response.json();
            })
            .then(numberOfKillByKillerVictimWeapon => {
                UT4_STATS.worstJumper = numberOfKillByKillerVictimWeapon[WORLD].MOD_FALLING;
                UT4_STATS.hotPotato = numberOfKillByKillerVictimWeapon[WORLD].UT_MOD_FLAG;
                UT4_STATS.spawnIntruder = numberOfKillByKillerVictimWeapon[WORLD].UT_MOD_BERETTA;
                UT4_STATS.worstSwimmer = numberOfKillByKillerVictimWeapon[WORLD].MOD_WATER;

                UT4_STATS.killDistributionByKillerAndWeapon = _(numberOfKillByKillerVictimWeapon)
                    .reduce((iterator, stats, killer) => {
                        iterator[killer] = _(stats)
                            .map((countByVictim, weapon) => {
                                return [weapon, _(countByVictim).values().sum()]
                            })
                            .value();
                        return iterator;
                    }, {});
            })
            .catch(error => console.log(error));
    }

})();