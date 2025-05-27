import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './property/property.module';
import { BusinessModule } from './business/business.module';
import { EventModule } from './event/event.module';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';
import { ProfessionModule } from './profession/profession.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    PropertyModule,
    BusinessModule,
    EventModule,
    CategoryModule,
    ReviewModule,
    ProfessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
