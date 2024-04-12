//Las entidades hacen una referencia a como exactamente vamos a grabar en nuestra db. Coleccion en el caso de mongo.
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

//Como quiero que sea un documento, lo extendemos de Document. Decorador Schema de nest, para indicar que es un schema de db
//Schemas are used to define Models. Models are responsible for creating and reading documents from the underlying MongoDB database
@Schema()
export class Pokemon extends Document{

    @Prop({
        unique: true,
        index: true
    })
    name:string;

    @Prop({
        unique: true,
        index: true
    })
    no:number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);