import { 
    IsString, 
    MinLength, 
    IsPositive,   
    IsInt,
    Matches, 
} 
from "class-validator"

export class CreatePokemonDto {


@IsPositive()
@IsInt()  
no: number;


@IsString()
@MinLength(1)
@Matches(/[a-z]/)    
name:string;

}
