(function () {

    const WORLD = "<world>"
    const SUICIDE_CAUSES = "MOD_FALLING";
    const UT4_STATS = {
        suicides: [],
        clumsy: []
    }

    fetchServerData()
        .then(() => refreshTable(UT4_STATS.suicides, '#suicides'))
        .then(() => refreshTable(UT4_STATS.clumsy, '#clumsy'));

    function fetchServerData() {
        let shouldContinue = true;

        return fetch(`http://home/api/stats`)
            .then(response => {
                return response.json();
            })
            .then(numberOfKillByKillerVictimWeapon => {
                UT4_STATS.suicides = _(numberOfKillByKillerVictimWeapon)
                    .filter(data => data['_id'].killer === WORLD)
                    .filter(data => SUICIDE_CAUSES == data['_id'].weapon)
                    .map(data => {
                        return {
                            name: data['_id'].victim,
                            count: data.count
                        }
                    })
                    .orderBy('count', 'desc')
                    .value()

                UT4_STATS.clumsy = _(numberOfKillByKillerVictimWeapon)
                    .filter(data => data['_id'].killer ===  data['_id'].victim)
                    .map(data => {
                        return {
                            name: data['_id'].victim,
                            count: data.count
                        }
                    })
                    .orderBy('count', 'desc')
                    .value()
            })
            .catch(error => console.log(error));
    }

})();