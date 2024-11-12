import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit: number;
  private defaultOffset: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('paginationDefaultLimit') || 5;
    this.defaultOffset = this.configService.get<number>('paginationDefaultOffset') || 0;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemonCreated = await this.pokemonModel.create(createPokemonDto);
      return pokemonCreated;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = this.defaultOffset } = paginationDto;
    let pokemons: Pokemon[] = [];

    //Ordeno asc segun no de elemento pokemon
    pokemons = await this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
      no: 1,
    })
    .select('-__v');  //Evito trae version de cada objeto pokemon (deselecciono)
    return pokemons;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    //By Name
    if (isNaN(+term)) {
      //throw new BadRequestException(`(param no) debe ser un numero`)
      pokemon = await this.pokemonModel.findOne({ name: term });
    }

    //By MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //By No.
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon no encontrado por este termino de busqueda`,
      );
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      console.log(`UpdatePokemon term: ${term}`);
      let findPokemon = await this.findOne(term);
      console.log(`FindedPokemon: `);
      console.log(findPokemon);
      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      const updatePokemon = await findPokemon.updateOne(updatePokemonDto, {
        new: true,
      });
      console.log(updatePokemon);

      //Return updated pokemon:
      return {
        ...findPokemon.toJSON(),
        ...updatePokemonDto,
      };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async remove(id: string) {
    console.log(`Delete ID: ${id}`);
    /*
    //Busca por termino y elimina el encontrado
    let pokemon: Pokemon = await this.findOne(term);
    await pokemon.deleteOne();
    */

    const deletePokemon = await this.pokemonModel.deleteOne({ _id: id });

    if (deletePokemon.deletedCount === 0)
      throw new BadRequestException(`Id: ${id} no fue encontrado.`);

    return deletePokemon;
  }

  private handleExceptions(err) {
    console.log(`${err?.code} - ${err?.message}`);
    if (err?.code === 11000)
      throw new BadRequestException(
        `Este registro ya existe en la db, y debe ser unico`,
      );

    throw new InternalServerErrorException(`Error al actualizar`);
  }
}
