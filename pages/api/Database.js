import * as SQLite from "expo-sqlite";
//import SQLite from "react-native-sqlite-storage";
//SQLite.DEBUG(true);
//SQLite.enablePromise(true);
console.log(SQLite);

// const database_name = "Reactoffline.db";
// const database_version = "1.0";
// const database_displayname = "SQLiteDb";
// const database_size = 200000;
//The Android's default system path of your application database.
const DB_PATH = "databases/";
const DB_NAME = "studentDB";

var database_name = "sqliteexample"; // Add your Database name
var database_version = "1.0"; // Add your Database Version
var database_size = 200000; // Add your Database Size
var database_displayname = "SQL Database"; // Add your Database Displayname
var db; 

const utility = require('./Utility');
const build_param = utility.build_param;
const build_paramz = utility.build_paramz;
const build_in_param = utility.build_in_param;
const insert_param = utility.insert_param;
const insert_params = utility.insert_params;
const update_param = utility.update_param;

export default class Database {

  errorCB(err) {
    console.log("SQL Error: " + err);
  };
  
  successCB() {
    console.log("SQL executed fine");
  };
  
  openCB() {
    console.log("Database OPENED");
  };
  
  openDB() {
   db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
   return db;
  }

  
initDB = (TABLE_NAME, TABLE_STRUCTURE) => {  
        const sql1 = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (${TABLE_STRUCTURE})`;
        const sql = `SELECT id FROM ${TABLE_NAME} LIMIT 1`          
        let db = this.openDB();
            try {
              db.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                  //console.log(`TABLE ${TABLE_NAME} available...`);
                }, function (h, error) {
                    console.log(`TABLE ${TABLE_NAME} EXIST :${error.message} `);
                    db.transaction((tx) => {
                          tx.executeSql(sql1, [], (tx, result) => { console.log(`TABLE ${TABLE_NAME} CREATED`)});
                      }, (h, error) => {
                        console.log(`FAILED TO CREATE TABLE:${error.message}`);
                      }, () => {
                        console.log("Table created successfully");
                      } 
                    )
                  
                });
              });
            } catch (ex) {
              console.log("error in updateITEMNAME " + JSON.stringify(ex));
              console.log("Received error: ", error);
              console.log("Database not yet ready ... populating data");
                  db.transaction((tx) => {
                      tx.executeSql(sql1, [], (tx, result) => {console.log(`CREATING ${TABLE_NAME}`)});
                  }, (t, error) => {
                    console.log(`FAILED TO CREATE TABLE:${error.message}`);
                  }, () => {
                    console.log("Table created successfully");
                  } 
                );
            }
};


closeDatabase(db) {
    if (db) {
      //console.log("Closing DB");
       //db._db.close()
      //console.log("Database CLOSED");
    } else {
      console.log("Database was not OPENED");
    }
  };

  select(TABLE_NAME, TABLE_STRUCTURE, param, callback) {
    let completeQuery = build_param(param);
    
    const query = `SELECT *  FROM ${ TABLE_NAME } ${ completeQuery }`;
    const st = this.initDB(TABLE_NAME, TABLE_STRUCTURE);
    let db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
    
    db.transaction(
              (tx) => { 
                tx.executeSql(query, [], (transaction, result) => {
                    callback(result.rows);
                  },
                  (error) => {console.log(error);}
                ) 
              }, 
              (error)=>{console.log(error)}, 
              //db._db.close()
      );
    }

    selectIN(TABLE_NAME, TABLE_STRUCTURE, param, callback) {
      let completeQuery = build_in_param(param);
      const query = `SELECT *  FROM ${ TABLE_NAME } ${ completeQuery }`;
      const st = this.initDB(TABLE_NAME, TABLE_STRUCTURE);
      let db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
      
      db.transaction(
                (tx) => { 
                  tx.executeSql(query, [], (transaction, result) => {
                      callback(result.rows);
                    },
                    (t, error) => {console.log(error);}
                  ) 
                }, 
                (t, error)=>{console.log(error)}, 
                this.closeDatabase(db)
        );
      }

     
    selectQuestions(TABLE_NAME, TABLE_STRUCTURE, param, callback) {
      let completeQuery = build_in_param(param);
      const query0 = " SELECT  GROUP_CONCAT(name) as names FROM answers WHERE  answers.questionID = questions.id GROUP BY questionID ";
      const query1 = " SELECT  GROUP_CONCAT(name) as names FROM distractors WHERE  distractors.questionID = questions.id GROUP BY questionID ";
      const query = `SELECT *, questions.id as qid, instructions.id as ind, instructions.name as namex, (${query0}) AS answer, (${query1}) AS distractor FROM questions LEFT JOIN instructions ON questions.instructionID = instructions.id ${ completeQuery } LIMIT 20`;
      console.log(query);
      const st = this.initDB(TABLE_NAME, TABLE_STRUCTURE);
      let db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
      
      db.transaction(
                (tx) => { 
                  tx.executeSql(query, [], (transaction, result) => {
                      
                      callback(result.rows);
                    },
                    (t, error) => {console.log(error);}
                  ) 
                }, 
                (t, error)=>{console.log(error)}, 
                this.closeDatabase(db)
        );
      }


  selectOne(TABLE_NAME, TABLE_STRUCTURE, param, callback) {
    let completeQuery = build_paramz(param);
    const query = `SELECT *  FROM ${ TABLE_NAME } ${ completeQuery } LIMIT 1`;
    console.log(query);
    const st = this.initDB(TABLE_NAME, TABLE_STRUCTURE);
    let db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
    
    db.transaction(
              (tx) => { 
                tx.executeSql(query, [], (transaction, result) => {
                    callback(result.rows);
                  },
                  (error) => {console.log(error);}
                ) 
              }, 
              (error)=>{console.log(error)}, 
              //db._db.close()
      );
    }

  async insert(db, TABLE_NAME, TABLE_STRUCTURE, param, callback) {
    let completeQuery = insert_param(param);
    
    const query = `INSERT OR IGNORE INTO ${TABLE_NAME} ${completeQuery[0]} VALUES ${completeQuery[1]}`;
    
    db.transaction((tx) => {tx.executeSql(query, [], (transaction, result) => {
                        if (callback)
                        {
                          console.log(`${TABLE_NAME} INSERTED INTO ROW ${result.insertId}`);
                          callback(result)
                        }
                      },
                      (t, error) => {
                        console.log(error.message);
                      }
                    ) 
                  }, 
                  (t, error)=>{console.log(error.message)}, 
                  //this.closeDatabase(db)`
          )
      }
   async insertTest(db, TABLE_NAME, TABLE_STRUCTURE, param, status, callback) {
    let insert_array = []
    let qux = '';
    let nux = '';
    if(status == 1){
    qux = '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    nux = '(id, userID, subjectID, title, description, testtime, settings, ids, instructions, questions, answers, options, questionweigth, active, updated_at, created_at)';
    insert_array = [
            null,
            param.userID,
            param.subjectID,
            param.title,
            param.description,
            param.testtime,
            param.settings,
            param.ids,
            param.instructions,
            param.questions,
            param.answers,
            param.options,
            param.questionweigth,
            null,
            null,
            null
          ];
        }
    else if(status == 2){
      qux = '(?, ?, ?, ?, ?, ?)';
      nux = '(id, title, description, testtime, settings, updated_at)';
      insert_array = [
        param.id,
        param.title,
        param.description,
        param.testtime,
        param.settings,
        null
      ];
    }
    const query = `INSERT OR REPLACE INTO ${TABLE_NAME} ${nux} VALUES ${qux} `;
    
    db.transaction((tx) => {tx.executeSql(query, insert_array, (transaction, result) => {
                        if (callback)
                        {
                          console.log(`${TABLE_NAME} INSERTED INTO ROW ${result.insertId}`);
                          callback(result)
                        }
                        console.log(`${TABLE_NAME} INSERTED INTO ROW ${result.insertId}`);
                      },
                      (t, error) => {
                        console.log(error.message);
                      }
                    ) 
                  }, 
                  (error)=>{console.log(error.message)}, 
                  //this.closeDatabase(db)
          );
      }
   async insertReturn(db, TABLE_NAME, TABLE_STRUCTURE, param, callback) {
    let completeQuery = insert_param(param);
    
    const query = `INSERT OR IGNORE INTO ${TABLE_NAME} ${completeQuery[0]} VALUES ${completeQuery[1]}`;
    
    db.transaction((tx) => {tx.executeSql(query, [], (transaction, result) => {
                        if (callback)
                        {
                          rest = this.selectOne(TABLE_NAME, TABLE_STRUCTURE, {id:result.insertId})
                          callback(result)
                        }
                      },
                      (error) => {console.log(error.message);}
                    ) 
                  }, 
                  (error)=>{console.log(error.message)}, 
                  this.closeDatabase(db)
          );
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
          this.closeDatabase(db)
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }


  async drop(TABLE_NAME, TABLE_STRUCTURE) {
   
    const query = `DROP TABLE ${TABLE_NAME} `;
    const st = await this.initDB(TABLE_NAME, TABLE_STRUCTURE);
    let db = await SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
    
    db.transaction((tx) => {tx.executeSql(query, [], (transaction, result) => {
                  console.log(`DROP ${TABLE_NAME}`);
              },
              (error) => {console.log(error.message);}
            ) 
          }, 
          (error)=>{console.log(error.message)
          }
        );
      }

}