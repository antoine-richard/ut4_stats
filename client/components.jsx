function objectToOrderedTable(object, selector) {
    ReactDOM.render(<table>
        <thead>
            <tr>
                <td>Player</td>
                <td>Count</td>
            </tr>
        </thead>
        <tbody>
            {
                _(object)
                    .map((value, key) => {
                        return { name: key, count: value };
                    })
                    .orderBy('count', 'desc')
                    .map(stat => {
                        return <tr key={stat.name}>
                            <td>{stat.name}</td>
                            <td>{stat.count}</td>
                        </tr>
                    })
                    .value()
            }
        </tbody>
    </table>, document.querySelector(selector))
}