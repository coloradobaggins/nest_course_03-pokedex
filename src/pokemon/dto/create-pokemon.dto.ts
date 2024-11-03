import { IsNumber, IsString } from "class-validator";

export class CreatePokemonDto {

    @IsNumber()
    no: number;

    @IsString({ message: 'name debe ser un string' })
    name: string;
}
