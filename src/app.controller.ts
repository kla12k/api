import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getServerInfo() {
    return {
      message: "Hello 👋 This is the server speaking",
      appName: "Business Directory Api",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      server_status: "API Running",
    };
  }

  // Keep the original hello endpoint if needed
  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
