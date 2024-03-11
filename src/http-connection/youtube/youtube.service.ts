/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

require('dotenv').config();

@Injectable()
export class YoutubeService {
  constructor(private httpService: HttpService) {}

  async getPlaylistItems(playlistID: string) {
    const titles = [];
    const url = `${process.env.YOUTUBE_URL}/playlistItems?part=snippet&playlistId=${playlistID}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`;

    try {
      const response = await lastValueFrom(this.httpService.get(url));
      const items = response.data.items;
      for (const item of items) {
        titles.push(
          item.snippet.title.replace(/\[.*?\]|\(.*?\)|<.*?>/g, '').trim(),
        );
      }
      return titles;
    } catch (error) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
