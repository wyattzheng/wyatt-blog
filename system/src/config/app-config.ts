import { ConfigModule } from "@nestjs/config"

export const AppConfigModule = ConfigModule.forRoot({
    envFilePath:[".env",".env.example"]
});