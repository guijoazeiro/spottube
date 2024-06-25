import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as querystring from 'querystring';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { SpotifyTracksInterface } from '../../interfaces/spotify-tracks.interface';
import { CreatePlaylistInterface } from 'src/http-connection/interfaces/spotify-createPlaylist.interface';
import { AddTrackInterface } from 'src/http-connection/interfaces/spotify-addTrack.interface';
import { SpotifyTokenInterface } from 'src/http-connection/interfaces/spotify-token.interface';
import { SpotifyProfileInterface } from 'src/http-connection/interfaces/spotify-profile.interface';
@Injectable()
export class SpotifyService {
  constructor(private readonly httpService: HttpService) {}
  async getToken(
    code: string,
    redirect_uri: string,
    client_id: string,
    client_secret: string,
  ): Promise<SpotifyTokenInterface> {
    try {
      const response: AxiosResponse<SpotifyTokenInterface> =
        await lastValueFrom(
          this.httpService.post(
            'https://accounts.spotify.com/api/token',
            null,
            {
              params: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
              },
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization:
                  'Basic ' +
                  Buffer.from(client_id + ':' + client_secret).toString(
                    'base64',
                  ),
              },
            },
          ),
        );
      return response.data;
    } catch (error) {
      Logger.error(`Failed to get data ${error.message}`);
      throw new HttpException(
        'Failed to get Spotify token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTrackURI(track: string, token: string) {
    const url =
      'https://api.spotify.com/v1/search?' +
      querystring.stringify({
        q: track,
        type: 'track',
      });

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response: AxiosResponse<SpotifyTracksInterface> =
        await lastValueFrom(this.httpService.get(url, { headers }));

      const { items } = response.data.tracks;
      if (items.length > 0) {
        return items[0].uri;
      }
    } catch (error) {
      Logger.error(`Failed to get data ${error.message}`);
      throw new HttpException(
        'Failed to get Spotify token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createPlaylist(
    name: string,
    user_id: string,
    token: string,
  ): Promise<{
    playlistId: string;
    playlistUrl: string;
  }> {
    const url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = {
      name,
    };

    try {
      Logger.log(`Creating playlist`);
      const response: AxiosResponse<CreatePlaylistInterface> =
        await lastValueFrom(this.httpService.post(url, data, { headers }));

      return {
        playlistId: response.data.id,
        playlistUrl: response.data.external_urls.spotify,
      };
    } catch (error) {
      Logger.error(`Failed to get data ${error.message}`);
      throw new HttpException(
        'Failed to get Spotify token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addTracksToPlaylist(
    tracksUri: string[],
    playlistID: string,
    token: string,
  ) {
    const url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = {
      uris: tracksUri,
    };

    try {
      Logger.log(`Adding tracks to playlist`);
      if (tracksUri.length <= 100) {
        const response: AxiosResponse<AddTrackInterface> = await lastValueFrom(
          this.httpService.post(url, data, { headers }),
        );
        return response.data;
      } else {
        const chunks = this.splitTracksArray(tracksUri);
        const promises = chunks.map(
          (chunk): Promise<AxiosResponse<AddTrackInterface>> =>
            lastValueFrom(
              this.httpService.post(url, { uris: chunk }, { headers }),
            ),
        );

        const responses = await Promise.all(promises);
        return responses.map((response) => response.data);
      }
    } catch (error) {
      Logger.error(`Failed to get data ${error.message}`);
      throw new HttpException(
        'Failed to get Spotify token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  splitTracksArray(tracksArray: string[]) {
    const chunks = [];
    for (let i = 0; i < tracksArray.length; i += 100) {
      chunks.push(tracksArray.slice(i, i + 100));
    }
    return chunks;
  }

  async getProfile(token: string) {
    const url = 'https://api.spotify.com/v1/me';
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response: AxiosResponse<SpotifyProfileInterface> =
        await lastValueFrom(this.httpService.get(url, { headers }));
      return response.data.id;
    } catch (error) {
      Logger.error(`Failed to get data ${error}`);
      throw new HttpException(
        'Failed to get Spotify user data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
