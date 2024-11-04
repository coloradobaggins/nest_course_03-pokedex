import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PokeAPIResponse } from './interfaces/poke-api-response.interface';

@Injectable()
export class SeedService {

  constructor(private readonly httpService: HttpService) {}

  async runSeed(cant?:number): Promise<any> {
    
    try{
      const seedsRes = await firstValueFrom(this.httpService.get<PokeAPIResponse>(`https://pokeapi.co/api/v2/pokemon?limit=${cant ?? 300}`));
      const { results } = seedsRes.data;
      
      const mappedResults = results.map((poke)=>{
        const { name, url } = poke;
        let splittedUrl = url.split('/');
        const no = splittedUrl[splittedUrl.length-2];
        return {
          name,
          no,
          url,
        }
      });

      return mappedResults;
    }catch(err){
      throw new BadRequestException(`${err?.code} - ${err?.message}`);
    }

  }

}
