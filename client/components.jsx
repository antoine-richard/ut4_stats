function refreshTable(stats, selector) {
    ReactDOM.render(<table>
        <thead>
            <th>Player</th>
            <th>Count</th>
        </thead>
        <tbody>
            {_.map(stats, player => {
                return <tr>
                    <td>{player.name}</td>
                    <td>{player.count}</td>
                </tr>
            })}
        </tbody>
    </table>, document.querySelector(selector))
}