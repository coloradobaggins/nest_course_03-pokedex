import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PokeAPIResponse } from './interfaces/poke-api-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly httpService: HttpService
  ) {}

  async runSeed(cant?:number): Promise<any> {
    
    try{
      console.log(`Borrando pokemons para crear seed...`);
      await this.pokemonModel.deleteMany({});

      const seedsRes = await firstValueFrom(this.httpService.get<PokeAPIResponse>(`https://pokeapi.co/api/v2/pokemon?limit=${cant ?? 300}`));
      const { results } = seedsRes.data;
      
      const arrPromises = [];

      const mappedResults = results.map((poke)=>{
        const { name, url } = poke;
        let splittedUrl = url.split('/');
        const no = splittedUrl[splittedUrl.length-2];

        //arrPromises.push(this.pokemonModel.create({no, name}));
        arrPromises.push({no, name});

        return {
          name,
          no,
          url,
        }
      });

      //await Promise.all(arrPromises);
      await this.pokemonModel.insertMany(arrPromises);

      return `Seed created`;
    }catch(err){
      throw new BadRequestException(`${err?.code} - ${err?.message}`);
    }

  }

}
