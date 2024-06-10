import { Body, Controller, Post } from '@nestjs/common';
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
  async postPlaylist(@Body() createPlaylistDTO: CreatePlaylistDTO) {
    const { name, youtubeID, spotifyToken } = createPlaylistDTO;
    try {
      const profileId = await this.spotifyService.getProfile(spotifyToken);
      const youtubeTracks =
        await this.youtubeService.getPlaylistItems(youtubeID);

      const spotifyUriArray = await Promise.all(
        youtubeTracks.map(async (track) => {
          const spotifyUri = await this.spotifyService.getTrackURI(
            track,
            spotifyToken,
          );
          return spotifyUri;
        }),
      );

      const { playlistId, playlistUrl } =
        await this.spotifyService.createPlaylist(name, profileId, spotifyToken);

      const responseplaylist = await this.spotifyService.addTracksToPlaylist(
        spotifyUriArray,
        playlistId,
        spotifyToken,
      );

      return { playlistUrl, responseplaylist };
    } catch (error) {
      return error;
    }
  }
}
