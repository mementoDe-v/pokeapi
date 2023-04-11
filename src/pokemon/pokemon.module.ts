import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([
  { 

    name: Pokemon.name,
    schema: PokemonSchema,
  
  }])],

  controllers: [PokemonController],
  providers: [PokemonService]
})
export class PokemonModule {}
