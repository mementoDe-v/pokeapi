import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {


constructor (
  @InjectModel(Pokemon.name)
  private readonly pokemonModel: Model<Pokemon>
  ) {}


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()
    
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)

      return pokemon;

    } catch (error) {
      this.errorHandler(error)
    }
   
  }


  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    
    let pokemon:Pokemon;

    if ( !isNaN(+term) )  {
        pokemon =  await this.pokemonModel.findOne( {no: term} )
    }

    if ( !pokemon && isValidObjectId( term )) {
      pokemon =  await this.pokemonModel.findById( term )
    }

    if ( !pokemon )  {
      pokemon =  await this.pokemonModel.findOne( {name: term.toLowerCase()} )
    }
    
    if (!pokemon) throw new NotFoundException(`Pokemon with ${term} doesn't exist`)
      
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    try {

        const pokemon: Pokemon = await this.findOne( term );
        
        if (updatePokemonDto.name) {
          updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
        }

        await pokemon.updateOne(updatePokemonDto, { new: true })

        return {...pokemon.toJSON(), ...updatePokemonDto}

    } catch (error) {
      this.errorHandler(error)
  }

}

  async remove(id: string) {
    
    // const pokemon: Pokemon = await this.findOne( id );
    // await pokemon.deleteOne()

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
        if( deletedCount === 0 )
          throw new BadRequestException(`Pokemon with id ${ id } not found`);
    return;
  }

  

  private errorHandler(error: any){

    if ( error.code === 11000 ){
      throw new BadRequestException(`There is a Pokemon with this property already in DB. Please assign an uniq property ${JSON.stringify(error.keyValue)}`);
    }

    console.log(error);
    throw new InternalServerErrorException(`Can't update Pokemon. Check server logs`);

    }
    
  }


