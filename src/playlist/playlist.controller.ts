import { Body, Controller, Post } from '@nestjs/common';
import { YoutubeService } from 'src/http-connection/youtube/youtube.service';
import { CreatePlaylistDTO } from './create-playlist.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post('create')
  async postPlaylist(@Body() createPlaylistDTO: CreatePlaylistDTO) {
    try {
      return await this.youtubeService.getPlaylistItems(
        createPlaylistDTO.youtubeID,
      );
    } catch (error) {
      return error;
    }
  }
}
