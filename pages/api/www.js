import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Reactoffline.db";
const database_version = "1.0";
const database_displayname = "SQLiteDb";
const database_size = 200000;

const utility = require('./Utility');
const build_param = utility.build_param;
const insert_param = utility.insert_param;
const update_param = utility.update_param;

export default class Database {
initDB = (TABLE_NAME, TABLE_STRUCTURE) => {  
        const sql1 = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (${TABLE_STRUCTURE})`;
        const sql = `SELECT id FROM ${TABLE_NAME} LIMIT 1`
        let db;
        return new Promise((resolve) => {
          console.log("Plugin integrity check ...");
          SQLite.echoTest()
            .then(() => { 
              console.log("Integrity check passed ...");
              console.log("Opening database ...");
              SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size
              )
                .then(DB => {
                  db = DB;
                  console.log("Database OPEN");
                  db.executeSql(sql).then(() => {
                      console.log("Database is ready ... executing query ...");
                  }).catch((error) =>{
                      console.log("Received error: ", error);
                      console.log("Database not yet ready ... populating data");
                      db.transaction((tx) => {
                          tx.executeSql(sql1);
                      }).then(() => {
                          console.log("Table created successfully");
                      }).catch(error => {
                          console.log(error);
                      });
                  });
                  resolve(db);
                })
                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {
              console.log(`echoTest failed - plugin not functional`);
            });
          });
};


closeDatabase(db) {
    if (db) {
      console.log("Closing DB");
      db.close()
        .then(status => {
          console.log("Database CLOSED");
        })
        .catch(error => {
          this.errorCB(error);
        });
    } else {
      console.log("Database was not OPENED");
    }
  };

  select(TABLE_NAME, TABLE_STRUCTURE, param) {
    let completeQuery = build_param(param)
    const sql = `SELECT *  FROM ${ TABLE_NAME } ${ completeQuery }`;
    console.log(sql);
    return new Promise((resolve) => {
      const res = [];
      this.initDB(TABLE_NAME, TABLE_STRUCTURE).then((db) => {
        db.transaction((tx) => {
          tx.executeSql(sql, []).then(([tx, results]) => {
            console.log("Query completed");
            var res = results.rows;
            resolve(res);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }


  selectOne(TABLE_NAME, TABLE_STRUCTURE, param) {
    let completeQuery = build_param(param)
    const sql = `SELECT *  FROM ${ TABLE } ${ completeQuery } LIMIT 1`;
    console.log(sql);
    return new Promise((resolve) => {
      this.initDB(TABLE_NAME, TABLE_STRUCTURE).then((db) => {
        db.transaction((tx) => {
          tx.executeSql(sql, []).then(([tx,results]) => {
            console.log(results);
            if(results.rows.length > 0) {
              let row = results.rows.item(0);
              resolve(row);
            }
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }


  insert(TABLE_NAME, TABLE_STRUCTURE, param) {
    let completeQuery = insert_param(param);
    const sql = `INSERT INTO ${TABLE_NAME} ${completeQuery[0]} VALUES ${completeQuery[1]}`;
    //const datas = [completeQuery[1]];

    return new Promise((resolve) => {
      this.initDB(TABLE_NAME, TABLE_STRUCTURE).then((db) => {
        db.transaction((tx) => {
          tx.executeSql(sql, []).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }


  update(TABLE_NAME, TABLE_STRUCTURE, data, param) {
    let completeQuery = update_param(param);
    let whereQuery = build_param(data);

    const sql = `UPDATE ${TABLE_NAME} SET ${completeQuery} ${whereQuery}`;
    return new Promise((resolve) => {
      this.initDB(TABLE_NAME, TABLE_STRUCTURE).then((db) => {
        db.transaction((tx) => {
          tx.executeSql(sql, []).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  delete(TABLE_NAME, TABLE_STRUCTURE, id) {
    return new Promise((resolve) => {
      this.initDB(TABLE_NAME, TABLE_STRUCTURE).then((db) => {
        db.transaction((tx) => {
          tx.executeSql(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]).then(([tx, results]) => {
            console.log(results);
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

}