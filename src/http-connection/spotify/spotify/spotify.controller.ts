import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import * as querystring from 'querystring';
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Controller('spotify')
export class SpotifyController {
  constructor(private httpService: HttpService) {}
  generateRandomString(length: number): string {
    const charSet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      randomString += charSet[randomIndex];
    }
    return randomString;
  }

  @Get('/login')
  async login(@Res() res: Response) {
    const client_id = process.env.CLIENT_ID;
    const redirect_uri = process.env.REDIRECT_URI;

    const state = this.generateRandomString(16);
    const scope = [
      'ugc-image-upload',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'streaming',
      'app-remote-control',
      'user-read-email',
      'user-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-read-private',
      'playlist-modify-private',
      'user-library-modify',
      'user-library-read',
      'user-top-read',
      'user-read-playback-position',
      'user-read-recently-played',
      'user-follow-read',
      'user-follow-modify',
    ];

    const authorizeUrl =
      'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      });

    return res.redirect(authorizeUrl);
  }

  @Get('/callback')
  async callback(@Query() queryParams: any, @Res() res: Response) {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uri = process.env.REDIRECT_URI;

    console.log(queryParams);
    const { code, state } = queryParams;
    // state = null;

    if (state === null) {
      res.redirect('/');
    }

    try {
      const response = await axios.post(
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
              Buffer.from(client_id + ':' + client_secret).toString('base64'),
          },
        },
      );
      return res.json(response.data);
    } catch (error) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }
  }
}
