import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    try{
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemonCreated = await this.pokemonModel.create(createPokemonDto);
      return pokemonCreated;
    }catch(err){
      if(err.code === 11000){
        console.log(`ERROR... ${err.code} - ${err.message}`);
        throw new BadRequestException(`Este registro ya existe enla db. No y Name deben ser unicos. ( ${JSON.stringify(err.keyValue)} )`);
      }
      console.log(err);
      throw new InternalServerErrorException(`Error al crear registro en db. Check logs.`);
    }
    
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon:Pokemon;

    //By Name
    if(isNaN(+term)){
      //throw new BadRequestException(`(param no) debe ser un numero`)
      pokemon = await this.pokemonModel.findOne({name: term});
    }

    //By MongoID
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    //By No.
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term});
    }

    
    if(!pokemon){
      throw new NotFoundException(`Pokemon no encontrado por este termino de busqueda`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    console.log(`UpdatePokemon term: ${term}`)
    

    let findPokemon = await this.findOne(term);
    console.log(`FindedPokemon: `);
    console.log(findPokemon);
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    const updatePokemon = await findPokemon.updateOne(updatePokemonDto, {new: true});
    console.log(updatePokemon);

    //Return updated pokemon:
    return {
      ...findPokemon.toJSON(), ...updatePokemonDto
    }

  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
