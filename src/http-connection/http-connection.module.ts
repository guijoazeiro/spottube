import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube/youtube.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [YoutubeService],
  exports: [YoutubeService],
})
export class HttpConnectionModule {}
