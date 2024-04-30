/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { YoutubeTracksInterface } from '../interfaces/youtube-tracks-interface';

require('dotenv').config();

@Injectable()
export class YoutubeService {
  constructor(private httpService: HttpService) {}

  async getPlaylistItems(playlistID: string): Promise<string[]> {
    const url = `${process.env.YOUTUBE_URL}/playlistItems?part=snippet&playlistId=${playlistID}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`;

    try {
      const response: AxiosResponse<YoutubeTracksInterface> =
        await lastValueFrom(this.httpService.get(url));
      const items = response.data.items;
      const titles = items.map((item): string => {
        return item.snippet.title.replace(/\[.*?\]|\(.*?\)|<.*?>/g, '').trim();
      });
      return titles;
    } catch (error) {
      console.error(error);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
