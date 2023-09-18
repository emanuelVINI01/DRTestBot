import * as mysql from 'mysql'
export default class UserRepository {
    /**
 * @param {mysql.Connection} connection
 */
    constructor(connection) {
        this.connection = connection
    }

    createTable() {
        this.connection.query("CREATE TABLE IF NOT EXISTS user_data (id TEXT, message_count INT)")
    }


    /**
     * @param {number} id
    */
    select(id, callback) {
        const query = mysql.format("SELECT * FROM user_data WHERE id = ?", [
            id
        ])
        this.connection.query(query, (errors, results, fields) => {
            let nowResult = results[0]
            if (nowResult == undefined) {
                callback(
                    this.create({
                        id,
                        messageCount: 0
                    })
                )
            }
            console.log(results)
            callback(
                {
                    id,
                    messageCount: nowResult["message_count"]
                }
            )
        })
    }
        /**
     * @param {{
        *  id : String
        *  messageCount : number
        * }} data
        */
    create(data) {
        const query = mysql.format("INSERT INTO user_data VALUES(?,?)", [
            data.id,
            data.messageCount
        ])
        this.connection.query(query)
        return data
    }
    /**
     * @param {{
     *  id : String
     *  messageCount : number
     * }} data
     */
    save(data) {
        const query = mysql.format("UPDATE user_data SET message_count = ? WHERE id = ?", [
            data.messageCount,
            data.id
        ])
        this.connection.query(query)
    }
}