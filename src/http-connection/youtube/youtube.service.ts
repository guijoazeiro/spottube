/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { YoutubeTracksInterface } from '../interfaces/youtube-tracks-interface';

require('dotenv').config();

@Injectable()
export class YoutubeService {
  constructor(private httpService: HttpService) {}

  async getPlaylistItems(playlistID: string): Promise<string[]> {
    const baseUrl = `${process.env.YOUTUBE_URL}/playlistItems`;
    const apiKey = process.env.YOUTUBE_API_KEY;
    let url = `${baseUrl}?part=snippet&playlistId=${playlistID}&maxResults=100&key=${apiKey}`;
    let allTitles: string[] = [];
    let nextPageToken: string | undefined = '';

    try {
      do {
        const response: AxiosResponse<YoutubeTracksInterface> =
          await lastValueFrom(this.httpService.get(url));
        const items = response.data.items;

        Logger.log(`Getting playlist ${playlistID} items`);

        const titles = items
          .map((item): string => {
            return item.snippet.title
              .replace(/\[.*?\]|\(.*?\)|<.*?>/g, '')
              .trim();
          })
          .filter((title) => {
            return (
              !title.toLowerCase().includes('deleted video') &&
              !title.toLowerCase().includes('private video')
            );
          });

        allTitles = allTitles.concat(titles);

        nextPageToken = response.data.nextPageToken;
        if (nextPageToken) {
          url = `${baseUrl}?part=snippet&playlistId=${playlistID}&maxResults=100&pageToken=${nextPageToken}&key=${apiKey}`;
        }
      } while (nextPageToken);

      return allTitles;
    } catch (error) {
      console.error(error);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
