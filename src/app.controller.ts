import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { YoutubeService } from './http-connection/youtube/youtube.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly youtubeService: YoutubeService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
