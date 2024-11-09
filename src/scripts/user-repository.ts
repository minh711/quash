import { User } from '../entities/user';

class UserRepository {
  private users: User[] = [];

  add(user: User) {
    this.users.push(user);
  }

  getAll(): User[] {
    return this.users;
  }

  getById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  delete(id: number) {
    this.users = this.users.filter((user) => user.id !== id);
  }

  update(updatedUser: User) {
    const index = this.users.findIndex((user) => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
  }
}

export default UserRepository;
