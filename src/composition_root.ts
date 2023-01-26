import "reflect-metadata";
import {UsersDbRepositoryClass} from "./repositories/users_db_repository";
import {AuthRepositoryClass} from "./repositories/auth_repository";
import {AuthServiceClass} from "./domain/auth_service";
import {AuthController} from "./controllers/auth_controller";
import {UserServiceClass} from "./domain/users_service";
import {UsersQwRepositoryClass} from "./repositories/user_query_repository";
import {UserController} from "./controllers/users_controller";
import {BlogsRepositoryClass} from "./repositories/blogs_db_repository";
import {BlogsService} from "./domain/blogs_service";
import {BlogsQwRepositoryClass} from "./repositories/blogs_qwery_repo";
import {PostsService} from "./domain/posts_service";
import {BlogsController} from "./controllers/blogs_controller";
import {PostsRepositoryClass} from "./repositories/posts_db_repository";
import {PostsQwRepositoryClass} from "./repositories/posts_qwery_repo";
import {CommentsQweryRepositoryClass} from "./repositories/comments_qwery_repository";
import {CommentsService} from "./domain/comments_service";
import {PostsController} from "./controllers/posts_controller";
import {CommentsDbRepositoryClass} from "./repositories/comments_db_repository";
import {CommentsController} from "./controllers/comments_controller";
import {SecurityController} from "./controllers/security_controller";
import {Container} from "inversify";


const usersDbRepository = new UsersDbRepositoryClass()
const authRepository = new AuthRepositoryClass()
const usersQwRepository = new UsersQwRepositoryClass()
const blogsRepository = new BlogsRepositoryClass()
const blogsQwRepository = new BlogsQwRepositoryClass()
const postsRepository = new PostsRepositoryClass()
const postsQwRepository = new PostsQwRepositoryClass()
const commentsQweryRepository = new CommentsQweryRepositoryClass()
const commentsDbRepository = new CommentsDbRepositoryClass()


export const authService = new AuthServiceClass(//for middleware
    usersDbRepository,
    authRepository)
/*const usersService = new UserServiceClass(
    authService,
    usersDbRepository)
export const blogsService = new BlogsService(blogsRepository)////for middleware
const postsService = new PostsService(postsRepository)
const commentsService = new CommentsService(commentsDbRepository)


export const authController = new AuthController(authService);
export const userController = new UserController(
    usersService,
    usersQwRepository);
export const blogsController = new BlogsController(
    blogsService,
    blogsQwRepository,
    postsService)
export const postsController = new PostsController(
    postsService,
    authService,
    blogsQwRepository,
    postsQwRepository,
    commentsQweryRepository,
    commentsService
    )
export const commentsController = new CommentsController(
    authService,
    commentsService,
    commentsQweryRepository);
export const securityController = new SecurityController(authService);*/

export const container = new Container();
container.bind(SecurityController).toSelf();
container.bind(CommentsController).toSelf();
container.bind(PostsController).toSelf();
container.bind(BlogsController).toSelf();
container.bind(UserController).toSelf();
container.bind(AuthController).toSelf();

container.bind(CommentsService).toSelf();
container.bind(PostsService).toSelf();
container.bind(UserServiceClass).toSelf();
container.bind(AuthServiceClass).toSelf();
container.bind(BlogsService).toSelf();

container.bind(AuthRepositoryClass).toSelf();
container.bind(BlogsRepositoryClass).toSelf();
container.bind(BlogsQwRepositoryClass).toSelf();
container.bind(CommentsDbRepositoryClass).toSelf();
container.bind(CommentsQweryRepositoryClass).toSelf();
container.bind(PostsRepositoryClass).toSelf();
container.bind(PostsQwRepositoryClass).toSelf();
container.bind(UsersQwRepositoryClass).toSelf();
container.bind(UsersDbRepositoryClass).toSelf();






















