import * as mysql from 'mysql'

export default class ServerRepository {

    /**
     * @param {mysql.Connection} connection
     */
    constructor(connection) {
        this.connection = connection
    }

    createTable() {
        this.connection.query("CREATE TABLE IF NOT EXISTS server_data (id TEXT, join_channel TEXT, join_message TEXT)")
    }


    /**
     * 
     * @param {string} id 
     * @param {Function} callback
     * @returns    {{
    *  id : String
    *  joinChannel : String
    * joinMessage : String
    * } | null} 
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
                    joinMessage: ""
                }
                this.create(data)
                callback(data)
                return
            }
            const nowResult = results[0]
            callback(
                {
                    id: nowResult["id"],
                    joinChannel: nowResult["join_channel"],
                    joinMessage: nowResult["join_message"],
                }
            )
        })
    }
    /**
 * @param {{
    *  id : String
    *  joinChannel : String
    * joinMessage : String
    * }} data
    */
    create(data) {
        console.log(data)
        const query = mysql.format("INSERT INTO server_data VALUES (?,?,?)", [
            data.id,
            data.joinChannel,
            data.joinMessage
        ])
        this.connection.query(query)
    }
    /**
* @param {{
    *  id : String
    *  joinChannel : String
    * joinMessage : String
    * }} data
    */
    save(data) {
        const query = mysql.format(
            "UPDATE server_data SET join_message = ?, join_channel = ? WHERE id = ?", [
            data.joinMessage == null ? "" : data.joinMessage,
            data.joinChannel,
            data.id
        ]
        )
        this.connection.query(query)
    }

}