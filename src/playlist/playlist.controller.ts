import { Body, Controller, Post, Req } from '@nestjs/common';
import { YoutubeService } from 'src/http-connection/youtube/youtube.service';
import { CreatePlaylistDTO } from './create-playlist.dto';
import { SpotifyService } from 'src/http-connection/spotify/spotify/spotify.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly youtubeService: YoutubeService,
    private readonly spotifyService: SpotifyService,
  ) {}

  @Post('create')
  async postPlaylist(@Body() createPlaylistDTO: CreatePlaylistDTO, @Req() req) {
    const { name, youtubeID } = createPlaylistDTO;
    try {
      const youtubeTracks =
        await this.youtubeService.getPlaylistItems(youtubeID);

      const spotifyUriArray = await Promise.all(
        youtubeTracks.map(async (track) => {
          const spotifyUri = await this.spotifyService.getTrackURI(
            track,
            process.env.SPOTIFY_TOKEN,
          );
          return spotifyUri;
        }),
      );

      const playlistID = await this.spotifyService.createPlaylist(
        name,
        process.env.SPOTIFY_USER_ID,
        process.env.SPOTIFY_TOKEN,
      );

      const responseplaylist = await this.spotifyService.addTracksToPlaylist(
        spotifyUriArray,
        playlistID,
        process.env.SPOTIFY_TOKEN,
      );

      console.log(req.session.user);

      return responseplaylist;
    } catch (error) {
      return error;
    }
  }
}
