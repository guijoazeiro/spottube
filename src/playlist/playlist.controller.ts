import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlaylistDTO } from './create-playlist.dto';
import { PlaylistService } from './playlist.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post('create')
  async postPlaylist(@Body() createPlaylistDTO: CreatePlaylistDTO) {
    return this.playlistService.createPlaylist(createPlaylistDTO);
  }
}
