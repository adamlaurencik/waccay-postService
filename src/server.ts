import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import UserRoute from './routes/user.route';
import PostRoute from './routes/post.route';

validateEnv();

const app = new App([new UserRoute(), new PostRoute()]);

app.listen();
