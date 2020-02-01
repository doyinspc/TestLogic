import * as SQLite from "expo-sqlite";
var DB_PATH = 'databases/';

var database_name = 'examDB';
var database_version = '1.0';
var database_size = 200000; 
var database_displayname = 'mocktest'; 

var db; 
const utility = require('./Utility');
const schema = require('./Schema');

const build_param = utility.build_param;
const build_paramz = utility.build_paramz;
const build_in_param = utility.build_in_param;
const build_in_paramx = utility.build_in_paramx;
const insert_param = utility.insert_param;
const insert_params = utility.insert_params;
const update_param = utility.update_param;

function openDB() {
  db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, openCB, errorCB);
  return db;
 }

function errorCB(err) {
  console.log("SQL Error: " + err);
};

function successCB() {
  console.log("SQL executed fine");
};

function openCB() {
  console.log("Database OPENED");
};

export default class Database {
  
  constructor(){
      this.db = this.openDB();
      this.createAll();
      //this.removeAll(); 
  }

  createAll()
  {
    Object.keys(schema).map((sch)=>{
      this.initDB(schema[sch].name, schema[sch].schema);
    })
  }

  removeAll()
  {
    console.log('Removing Tables');
    Object.keys(schema).forEach((sch)=>{
      this.drop(schema[sch].name, schema[sch].schema);
    })
  }

  openDB() {
    db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, openCB, errorCB);
    return db;
   } 
  
  

initDB = (TABLE_NAME, TABLE_STRUCTURE) => {  
  
        const sql1 = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (${TABLE_STRUCTURE})`;
        const sql = `SELECT id FROM ${TABLE_NAME} LIMIT 1`          
        let db = this.openDB();
            try {
              db.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                  console.log(`TABLE ${TABLE_NAME} available...`);
                }, function (h, error) {
                    console.log(`TABLE ${TABLE_NAME} DOES NOT EXIST : ${error.message} `);
                    db.transaction((tx) => {
                          tx.executeSql(sql1, [], 
                            (tx, result) => { console.log(`TABLE ${TABLE_NAME} CREATED`)});
                      }, (error) => {
                        console.log(`FAILED TO CREATE TABLE:${error.message}`);
                      }, () => {
                        console.log("Table created successfully");
                      } 
                    )
                  
                });
              });
            } catch (ex) {
              console.log("error in updateITEMNAME " + JSON.stringify(ex));
              console.log("Received error: ", ex);
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
       db._db.close()
      //console.log("Database CLOSED");
    } else {
      console.log("Database was not OPENED");
    }
  };

  select(TABLE_NAME, TABLE_STRUCTURE, param, callback) {
    let completeQuery = build_param(param);
    const query = `SELECT *  FROM ${ TABLE_NAME } ${ completeQuery }`;
    
    db.transaction(
              (tx) => { 
                tx.executeSql(query, [], (transaction, result) => {
                    callback(result.rows);
                  },
                  (t, error) => {
                    callback(1);
                    console.log(error)
                  }
                ) 
              }, 
              (error)=>{
                callback(1)
              }, 
             
      );
    }

    selectIN(TABLE_NAME, TABLE_STRUCTURE, param, callback) {
      
      let completeQuery = build_in_param(param);
      const query = `SELECT *  FROM ${ TABLE_NAME } ${ completeQuery }`;
      
      this.db.transaction(
                (tx) => { 
                  tx.executeSql(query, [], (transaction, result) => {
                      callback(result.rows);
                    },
                    (t, error) => {console.log(error); callback(1)}
                  ) 
                }, 
                (t, error)=>{callback(1)}, 
        );
      }

      selectINS(TABLE_NAME, TABLE_STRUCTURE, param, num, callback) {
      let completeQuery = build_in_param(param);
      const query = `SELECT *  FROM ${ TABLE_NAME } ${ completeQuery } LIMIT ${num}`;
      console.log(query);
      this.db.transaction(
                (tx) => { 
                  tx.executeSql(query, [], (transaction, result) => {
                      callback(result.rows);
                    },
                    (t, error) => {console.log(error); callback(1)}
                  ) 
                }, 
                (t, error)=>{callback(1)}, 
        );
      }

     
    selectQuestions(TABLE_NAME, TABLE_STRUCTURE, param, num, callback) {
      
      const query0 = " SELECT  GROUP_CONCAT(id || ':::' || name , ':::::') as names FROM answers WHERE  answers.questionID = questions.id GROUP BY questionID ";
      const query1 = " SELECT  GROUP_CONCAT(id || ':::' || name , ':::::') as names FROM distractors WHERE  distractors.questionID = questions.id GROUP BY questionID ";
      const query = `SELECT *, questions.id as qid, instructions.id as ind, instructions.name as namex, instructions.topicID as td, (${query0}) AS answer, (${query1}) AS distractor FROM questions LEFT JOIN instructions ON questions.instructionID = instructions.id WHERE instructions.topicID IN (${param}) ORDER BY RANDOM() LIMIT ${num}`;
      
      const q = `(SELECT * FROM instructions WHERE instructions.topicID IN (${param}))`;
      const q1 = `SELECT *, questions.id as qid, instructions.id as ind, instructions.name as namex, instructions.topicID as td, (${query0}) AS answer, (${query1}) AS distractor FROM questions LEFT JOIN ${q} as instr ON questions.instructionID = instr.id LIMIT ${num}`;
      console.log(query);
      this.db.transaction(
                (tx) => { 
                  tx.executeSql(query, [], (transaction, result) => {
                     
                    callback(result.rows._array);
                    },
                    (t, error) => {
                      callback(1);
                      console.log(error)
                    }
                  ) 
                }, 
                (t, error)=>{
                  callback(1);
                  console.log(error)
                }, 
                
        );
      }


  selectOne(TABLE_NAME, TABLE_STRUCTURE, param, callback) {
    let completeQuery = build_paramz(param);
    const query = `SELECT *  FROM ${ TABLE_NAME } ${ completeQuery } LIMIT 1`;
    this.db.transaction(
              (tx) => { 
                tx.executeSql(query, [], (transaction, result) => {
                    callback(result.rows);
                  },
                  (t, error) => {console.log(error);}
                ) 
              }, 
              (t, error)=>{console.log(error)}, 
      );
    }

  inserts(TABLE_NAME, TABLE_STRUCTURE, param, callback) {
    let completeQuery = insert_param(param);
    const query = `INSERT OR IGNORE INTO ${TABLE_NAME} ${completeQuery[0]} VALUES ${completeQuery[1]}`;
    this.db.transaction((tx) => {tx.executeSql(query, [], (transaction, result) => {
                          callback(result.insertId)
                      },
                      (t, error) => {
                        callback('xx');
                        console.log(error.message);
                      }
                    ) 
                  }, 
                  (t, error)=>{
                    callback('xx');
                    console.log(error.message)
                  },     
          )
      }

  insert(TABLE_NAME, TABLE_STRUCTURE, param, callback) {
        let insert_array = []
        let quxs = [];
        let nuxs = [];
        Object.keys(param).forEach((para)=>{
            nuxs.push(para);
            quxs.push(`?`);
            insert_array.push(param[para]);
        })
        let nux = `${nuxs.toString()}`; 
        let qux = `${quxs.toString()}`; 

    const query = `INSERT OR IGNORE INTO ${TABLE_NAME} (${nux}) VALUES (${qux})`;
    
    this.db.transaction((tx) => {tx.executeSql(query, insert_array, (transaction, result) => {
                          if(result.insertId > 0)
                          {
                            callback(result.insertId)
                          }
                      },
                      (t, error) => {
                        callback('xx');
                        
                      }
                    ) 
                  }, 
                  (t, error)=>{
                    callback('xx');
                   
                  },     
          )
      }

  update(TABLE_NAME, TABLE_STRUCTURE, param, callback) {
    
    let completeQuery = insert_param(param);
    const query = `INSERT OR IGNORE INTO ${TABLE_NAME} ${completeQuery[0]} VALUES ${completeQuery[1]}`;
    this.db.transaction((tx) => {tx.executeSql(query, [], (transaction, result) => {
                          callback(result)
                      },
                      (t, error) => {
                        console.log(error.message);
                      }
                    ) 
                  }, 
                  (t, error)=>{console.log(error.message)},     
          )
      }

  insertScore(TABLE_NAME, TABLE_STRUCTURE, param, status, callback) {
        this.initDB(TABLE_NAME, TABLE_STRUCTURE);
        let insert_array = []
        let qux = '';
        let nux = '';

        if(status == 1){
        qux = '(?, ?, ?, ?, ?, ?, ?, ?)';
        nux = '(id, testID, score, timeleft, choices, ended_at, created_at, updated_at )';
        insert_array = [
                null,
                param.testID ? param.testID :null ,
                param.score ? param.score :null,
                param.timeleft ? param.timeleft : 0,
                param.choices ? param.choices :null,
                param.ended_at ? param.ended_at :null,
                null,
                null
              ];
              
        }


        let query = `INSERT OR REPLACE INTO ${TABLE_NAME} ${nux} VALUES ${qux} `;
        
        this.db.transaction((tx) => {tx.executeSql(query, insert_array, (transaction, result) => {
                            if (callback)
                            {
                              console.log(`${TABLE_NAME} INSERTED INTO ROW ${result.insertId}`);
                              callback(result.insertId)
                            }
                            console.log(`${TABLE_NAME} INSERTED INTO ROW ${result.insertId}`);
                          },
                          (t, error) => {
                            console.log(error.message);
                          }
                        ) 
                      }, 
                      (error)=>{console.log(error.message)}, 
              );
          }   

  update(TABLE_NAME, TABLE_STRUCTURE, param, id, callback) {
        let insert_array = []
        let qux = '';
        let quxs = [];
        Object.keys(param).forEach((para)=>{
            quxs.push(` ${para} = ? `);
            insert_array.push(param[para])
        })
        qux = `${quxs.toString()}`;   
       
        let query = `UPDATE ${TABLE_NAME} SET ${qux} WHERE id = ${id} `;
        this.db.transaction((tx) => {tx.executeSql(query, insert_array, (transaction, result) => {
                            if (callback)
                            {
                              console.log(`${TABLE_NAME} UPDATED INTO ROW ${result}`);
                              callback(result)
                            }
                          },
                          (t, error) => {
                            callback(0);
                            console.log(error.message);
                          }
                        ) 
                      }, 
                      (t, error)=>{
                        callback(0) ; 
                        console.log(error.message)}, 
                      
              );
          }  

  insertTest(TABLE_NAME, TABLE_STRUCTURE, param, status, callback) {
    this.initDB(TABLE_NAME, TABLE_STRUCTURE);
    let insert_array = []
    let qux = '';
    let nux = '';
    if(status == 1){
    qux = '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    nux = '(id, userID, topics, subjectID, title, description, testtime, settings, ids, instructions, questions, answers, options, questionweigth, active, updated_at, created_at)';
    insert_array = [
            null,
            param.userID,
            param.topics,
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
    
    this.db.transaction((tx) => {tx.executeSql(query, insert_array, (transaction, result) => {
                        if (callback)
                        {
                          console.log(`${TABLE_NAME} INSERTED INTO ROW ${result.insertId}`);
                          callback(result.insertId)
                        }
                        console.log(`${TABLE_NAME} INSERTED INTO ROW ${result.insertId}`);
                      },
                      (t, error) => {
                        console.log(error.message);
                        callback(0)
                      }) 
                  }, 
                  (error)=>{callback(0); console.log(error.message)}, 
                  //this.closeDatabase(this.db)
          );
      }

   async insertReturn(TABLE_NAME, TABLE_STRUCTURE, param, callback) {
    let completeQuery = insert_param(param);
    
    const query = `INSERT OR IGNORE INTO ${TABLE_NAME} ${completeQuery[0]} VALUES ${completeQuery[1]}`;
    let db = this.db;
    this.db.transaction((tx) => {tx.executeSql(query, [], (transaction, result) => {
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
                  
          );
      }


  delete(TABLE_NAME, TABLE_STRUCTURE, id) {
    let db = this.db;
    return new Promise((resolve) => {
      this.initDB(TABLE_NAME, TABLE_STRUCTURE).then((db) => {
        db.transaction((tx) => {
          tx.executeSql(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id])
          .then(([tx, results]) => {
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


  drop(TABLE_NAME, TABLE_STRUCTURE) {
   
    const query = `DROP TABLE ${TABLE_NAME} `;
    this.db.transaction((tx) => {
      tx.executeSql(query, [], (transaction, result) => {
                  console.log(`DROP ${TABLE_NAME}`);
              },
              (t, error) => {
                console.log(error.message);
                callback(0)
              }
            ) 
          }, 
          (t, error)=>{console.log(error.message)}
        );
      }

}