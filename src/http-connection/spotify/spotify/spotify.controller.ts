import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import * as querystring from 'querystring';
import { SpotifyService } from './spotify.service';
import { generateRandomString, scope } from '../../../utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Controller('spotify')
export class SpotifyController {
  constructor(private spotifyService: SpotifyService) {}

  @Get('/login')
  async login(@Res() res: Response) {
    const client_id = process.env.CLIENT_ID;
    const redirect_uri = process.env.REDIRECT_URI;

    const state = generateRandomString(16);

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
  async callback(@Query() queryParams: any, @Req() req, @Res() res: Response) {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uri = process.env.REDIRECT_URI;

    const { code, state } = queryParams;

    if (state === null) {
      res.redirect('/');
    }

    try {
      const tokenData = await this.spotifyService.getToken(
        code,
        redirect_uri,
        client_id,
        client_secret,
      );
      req.session.user = 'teste';
      return res.json(tokenData);
    } catch (error) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }
  }
}
