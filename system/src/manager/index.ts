import { ArticleManager } from "./article-manager";
import { CategoryManager } from "./category-manager";
import { ImageStoreManager } from "./image-store-manager";
import { LinksManager } from "./links-manager";
import { SessionManager } from "./session-manager";
import { UserManager } from "./user-manager";

export const Managers = [
    ArticleManager,
    CategoryManager,
    ImageStoreManager,
    LinksManager,
    SessionManager,
    UserManager
];

export { ArticleManager,CategoryManager,ImageStoreManager,LinksManager,SessionManager,UserManager };


