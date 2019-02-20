process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

process.env.EXP_TOKEN = 60 * 69 * 24 * 30;

process.env.DATA_SEED = process.env.DATA_SEED || 'data-network';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

//Google client
process.env.CLIENT_ID = process.env.CLIENT_ID || '558309717069-lf18etqag8ooo11vllq1teui82jqr6ss.apps.googleusercontent.com';