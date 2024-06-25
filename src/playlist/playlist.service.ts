import { Injectable } from '@nestjs/common';
import { SpotifyService } from 'src/http-connection/spotify/spotify/spotify.service';
import { YoutubeService } from 'src/http-connection/youtube/youtube.service';
import { CreatePlaylistDTO } from './create-playlist.dto';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly youtubeService: YoutubeService,
  ) {}

  async createPlaylist(createPlaylistDTO: CreatePlaylistDTO) {
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
