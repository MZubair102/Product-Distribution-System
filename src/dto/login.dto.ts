import { IsNotEmpty,IsEmail,IsString, IsDefined} from "class-validator";

export class loginDto{
   
    @IsDefined({message:"Email is required"})
    @IsEmail()
    email:string;

    @IsDefined({message:"Password is required"})
    @IsString()
    password:string;

}