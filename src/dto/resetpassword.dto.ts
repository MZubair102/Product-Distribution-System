import { IsDate, IsDefined, IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class resetPasswordDto {

   @IsDefined({ message: "Email is required" })
   @IsEmail()
   email: string; 

  @IsDefined({ message: "OTP must be provided" })
  @IsNumber()
  otp:number


  @IsDefined({ message: "Password is required" })
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