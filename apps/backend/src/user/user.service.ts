import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createUserDto: CreateUserDto) {
    return {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    };
  }

  findAll() {
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password',
      },
    ];
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
