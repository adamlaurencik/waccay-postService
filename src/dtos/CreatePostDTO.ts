import {
  IsString,
  IsLatitude,
  IsLongitude,
  ValidateNested,
  IsOptional,
} from "class-validator";

class Location {
  @IsLatitude()
  latitude: string;
  @IsLongitude()
  longitude: string;
}

export class CreatePostDto {
    
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  name: string;

  @ValidateNested()
  @IsOptional()
  location?: Location;
}
