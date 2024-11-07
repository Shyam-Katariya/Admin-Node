import express, { json, urlencoded } from 'express';
import { join } from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import flash from 'connect-flash';
import passport from 'passport';
import expressSession from 'express-session';
import { configPassport } from './services/auth.service.js';
import mainRoute from './routes/main.routes.js';
import { registerHelpers } from './utils/helper.js';
import { errorHandler } from './utils/errorHandle.js';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection
const DB_URL = 'mongodb://admin:admin@localhost:27099/CRM?authSource=admin';

mongoose
    .connect(DB_URL)
    .then(() => {
        console.log('Connected to database successfully.....');
    })
    .catch((error) => {
        console.error('Failed to connect to the database!!!!!!', error);
    });

const app = express();

// Middleware setup
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(flash());

app.use(
    expressSession({
        secret: 'WCG',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

configPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});

// Static file serving
app.use(express.static(join(__dirname, 'public')));

registerHelpers(),
    // View engine setup (Handlebars)
    app.engine(
        'hbs',
        engine({
            extname: 'hbs',
            defaultLayout: 'main',
            handlebars: allowInsecurePrototypeAccess(Handlebars),
            helpers: Handlebars.helpers,
        })
    );
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

// Routes
app.use('/', mainRoute);

// Error handling middleware
app.use(errorHandler);

// Centralized error handler (this is where the error views will be rendered)
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error', { message: err.message }); // Ensure 'error' template exists in views
});

// Export the app
export default app;
