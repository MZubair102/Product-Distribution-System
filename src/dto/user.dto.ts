import { IsNotEmpty,IsEmail,IsStrongPassword ,MinLength,MaxLength, IsNumber, IsDefined} from "class-validator";


export class userDto{

    @IsDefined({message:"First name is required"})
    firstname:string;

    @IsDefined({message:"Last name is required"})
    lastname:string;

    @IsDefined({message:"Email is required"})
    @IsEmail()
    email:string;

    // @IsNotEmpty({ message: "OTP is required" })
    // @IsNumber()
    // otp:number

    @IsDefined({message:"Password is required"})
    @MinLength(5)
    @MaxLength(20)
    @IsStrongPassword({
        minUppercase:1,
        minLowercase:1,
        minNumbers:1,
        minSymbols:1
    },{message:"Password must contain at least one uppercase letter, one lowercase letter, one number and one symbol"})
    password:string;

}