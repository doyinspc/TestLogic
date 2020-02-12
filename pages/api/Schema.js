module.exports = {
    subject: {
        name:'subjects',
        schema: 'id INTEGER PRIMARY KEY , sid INTEGER, name TEXT NOT NULL, abbrv TEXT NULL, img TEXT NULL, active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP '
    },
    theme: {
        name:'themes',
        schema: 'id INTEGER PRIMARY KEY, subjectID INTEGER NOT NULL REFERENCES subjects, name TEXT NOT NULL, abbrv TEXT, img TEXT, active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP  '
    },
    topic: {
        name:'topics',
        schema: 'id INTEGER PRIMARY KEY, themeID INTEGER NOT NULL REFERENCES themes, name TEXT NOT NULL, abbrv TEXT, img TEXT, active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP  '
    },
    question: {
        name:'questions',
        schema: 'id INTEGER PRIMARY KEY, instructionID INTEGER NOT NULL REFERENCES instructions, question text NOT NULL, question_image NULL, question_audio NULL, question_video NULL, type DEFAULT NULL, option_type DEFAULT NULL, issued NULL, passed  NULL, active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP  '
    },
    instruction: {
        name:'instructions',
        schema: 'id INTEGER PRIMARY KEY, topicID INTEGER NOT NULL REFERENCES topics, name TEXT , content TEXT DEFAULT NULL, contenttitle  DEFAULT NULL, picslink TEXT DEFAULT NULL, active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP'
    },
    answer: {
        name:'answers',
        schema: 'id INTEGER PRIMARY KEY, questionID INTEGER NOT NULL REFERENCES questions, name TEXT NOT NULL, type INTEGER DEFAULT 0,  active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP'
    },
    distractor: {
        name:'distractors',
        schema: 'id INTEGER PRIMARY KEY, questionID INTEGER NOT NULL REFERENCES questions, name TEXT NOT NULL, type INTEGER DEFAULT 0,  active INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP '
    },
    test: {
        name:'tests',
        schema: `id INTEGER PRIMARY KEY , topics TEXT, userID TEXT , subjectID TEXT REFERENCES subject,title TEXT ,description TEXT ,testtime TEXT DEFAULT 0,settings TEXT,ids TEXT,
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
                    testID INTEGER NOT NULL REFERENCES tests,
                    score TEXT , 
                    timeleft INTEGER DEFAULT 0,
                    timespent TEXT DEFAULT NULL,
                    choices TEXT DEFAULT NULL,
                    started_at TEXT NULL ,
                    ended_at TEXT NULL ,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP  NOT NULL `
    },
    resource: {
        name:'resources',
        schema: `   id INTEGER PRIMARY KEY ,
                    topicID INTEGER NOT NULL,
                    data1 TEXT, 
                    data2 TEXT,
                    discription TEXT,
                    source TEXT,
                    author TEXT,
                    title  TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP  NOT NULL `
    },
    user: {
        name:'users',
        schema: `   id INTEGER PRIMARY KEY,
                    uniqueid TEXT,
                    name TEXT,
                    photourl TEXT NULL,
                    token TEXT NULL,
                    social INTEGER NULL,
                    category INTEGER DEFAULT 0,
                    active INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL `
    }




}