module.exports = {
    subject: {
        name:'subjects',
        schema: 'id INTEGER PRIMARY KEY , sid INTEGER, name TEXT NOT NULL, abbrv TEXT NULL, img TEXT NULL, active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP '
    },
    theme: {
        name:'themes',
        schema: 'id INTEGER PRIMARY KEY, subjectID INTEGER NOT NULL, name TEXT NOT NULL, abbrv TEXT, img TEXT, active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP  '
    },
    topic: {
        name:'topics',
        schema: 'id INTEGER PRIMARY KEY, themeID INTEGER NOT NULL, name TEXT NOT NULL, abbrv TEXT, img TEXT, active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP  '
    },
    question: {
        name:'questions',
        schema: 'id INTEGER PRIMARY KEY, instructionID INTEGER NOT NULL, question text NOT NULL, question_image NULL, question_audio NULL, question_video NULL, type DEFAULT NULL, option_type DEFAULT NULL, issued NULL, passed  NULL, active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP  '
    },
    instruction: {
        name:'instructions',
        schema: 'id INTEGER PRIMARY KEY, topicID INTEGER NOT NULL, name TEXT , content TEXT DEFAULT NULL, contenttitle  DEFAULT NULL, picslink TEXT DEFAULT NULL, active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP'
    },
    answer: {
        name:'answers',
        schema: 'id INTEGER PRIMARY KEY, questionID INTEGER NOT NULL, name TEXT NOT NULL, type INTEGER DEFAULT 0,  active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP'
    },
    distractor: {
        name:'distractors',
        schema: 'id INTEGER PRIMARY KEY, questionID INTEGER NOT NULL, name TEXT NOT NULL, type INTEGER DEFAULT 0,  active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP '
    },
    test: {
        name:'tests',
        schema: `id INTEGER PRIMARY KEY , userID TEXT ,subjectID TEXT ,title TEXT ,description TEXT ,testtime TEXT DEFAULT 0,settings TEXT,ids TEXT,
                    instructions TEXT,
                    questions TEXT,
                    answers TEXT,
                    options TEXT,
                    questionweigth TEXT, active INTEGER DEFAULT 0, 
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP  NOT NULL `
    },
    score: {
        name:'scores',
        schema: `   id INTEGER PRIMARY KEY ,
                    testID INTEGER NOT NULL,
                    score TEXT , 
                    timeleft INTEGER DEFAULT 0,
                    timespent TEXT DEFAULT NULL,
                    choices TEXT DEFAULT NULL,
                    started_at TEXT NULL ,
                    ended_at TEXT NULL ,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP  NOT NULL `
    },
    user: {
        name:'users',
        schema: `   id INTEGER PRIMARY KEY ,
                    username TEXT,
                    fullname TEXT,
                    password TEXT, 
                    hashkey TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL `
    }




}