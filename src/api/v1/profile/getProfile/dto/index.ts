import { User } from "../../../../../db/entities/User";

export class ProfileResponseDto {
  id: string;
  username: string;
  email: string;
  createdDate: Date;

  static from(user: User): ProfileResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdDate: user.createdDate,
    };
  }
}
