import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeopleModule } from './people/people.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { ResultsModule } from './results/results.module';
import { RankingModule } from './ranking/ranking.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { AuditModule } from './audit/audit.module';
import { ClientFeaturesModule } from './client-features/client-features.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        timezone: '-05:00',
      }),
      inject: [ConfigService],
    }),
    PeopleModule,
    CompetitionsModule,
    ResultsModule,
    RankingModule,
    AuthModule,
    DashboardModule,
    MaintenanceModule,
    AuditModule,
    ClientFeaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
