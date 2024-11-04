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
      this.handleExceptions(err);
    }
    
  }

  async findAll() {
    let pokemons: Pokemon[] = [];
    pokemons = await this.pokemonModel.find();
    console.log(`Get all pokemons (documents)`);
    console.log(pokemons)
    return pokemons;
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

    try{
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

    }catch(err){
      this.handleExceptions(err);
    }

  }

  async remove(id: string) {
    /*
    //Busca por termino y elimina el encontrado
    let pokemon: Pokemon = await this.findOne(term);
    await pokemon.deleteOne();
    */

    //Por id / Validation PIPES
    const pokemon = await this.findOne(id);
    await pokemon.deleteOne();
  }

  private handleExceptions(err){
    console.log(`${err?.code} - ${err?.message}`);
    if(err?.code === 11000)
      throw new BadRequestException(`Este registro ya existe en la db, y debe ser unico`);

    throw new InternalServerErrorException(`Error al actualizar`);
  }
}
