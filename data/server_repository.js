import * as mysql from 'mysql'

export default class ServerRepository {

    /**
     * @param {mysql.Connection} connection
     */
    constructor(connection) {
        this.connection = connection
    }

    createTable() {
        this.connection.query("CREATE TABLE IF NOT EXISTS server_data (id TEXT, join_channel TEXT, join_message TEXT, time_message INT)")
    }


    /**
     * 
     * @param {string} id 
     * @param {Function} callback
     */

    select(id, callback) {
        const query = mysql.format("SELECT * FROM server_data WHERE id = ?", [
            id
        ])
        this.connection.query(query, (errors, results, fields) => {
            if (results.length == 0) {
                const data = {
                    id,
                    joinChannel: "0",
                    joinMessage: "",
                    timeMessage: -1
                }
                this.create(data)
                callback(data)
                return
            }
            const result = results[0]
            callback(this.asServer(result))
        })
    }
    /**
     * 
     * @returns    {{
     *  id : String
     *  joinChannel : String
     * joinMessage : String
     * } | null} 
     */
    asServer(result) {
        return {
            id: result["id"],
            joinChannel: result["join_channel"],
            joinMessage: result["join_message"],
            timeMessage: result["time_message"]
        }
    }

    /**
     * @param {{
     *  id : String
     *  joinChannel : String
     * joinMessage : String
     * timeMessage: number
     * }} data
     */
    create(data) {
        const query = mysql.format("INSERT INTO server_data VALUES (?,?,?,?)", [
            data.id,
            data.joinChannel,
            data.joinMessage,
            data.timeMessage
        ])
        this.connection.query(query)
    }

    all(callback) {
        this.connection.query("SELECT * FROM server_data", (errors, results, fields) => {
            if (results.length == 0) {
                callback(
                    []
                )
            }
            const servers = []
            results.forEach(result => {
                console.log(result)
                servers.push(
                    this.asServer(result)
                )
            })
            callback(servers)
        })
    }

    /**
     * @param {{
     *  id : String
     *  joinChannel : String
     * joinMessage : String
     * timeMessage : number
     * }} data
     */
    save(data) {
        console.log("bba")
        console.log(data)
        const query = mysql.format(
            "UPDATE server_data SET join_message = ?, join_channel = ?, time_message = ? WHERE id = ?", [
                data.joinMessage == null ? "" : data.joinMessage,
                data.joinChannel,
                data.timeMessage,
                data.id
            ]
        )
        this.connection.query(query)
    }

}