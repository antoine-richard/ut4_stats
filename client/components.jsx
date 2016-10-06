function refreshTable(ut4Stats) {
    ReactDOM.render(<table>
        <thead>
            <th>Player</th>
            <th>Kills</th>
            <th>Death</th>
        </thead>
        <tbody>
            {Object.keys(ut4Stats.playerStats).map(player => {
                return <tr>
                    <td>{player}</td>
                    <td>{ut4Stats.playerStats[player].kills}</td>
                    <td>{ut4Stats.playerStats[player].deaths}</td>
                </tr>
            })}
        </tbody>
    </table>, document.querySelector('.content'))
}