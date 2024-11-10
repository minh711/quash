import { User } from '../entities/user';

export class UserRepository {
  private users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

  add(user: User) {
    this.users.push(user);
    this.updateLocalStorage();
  }

  getAll(): User[] {
    return this.users;
  }

  getById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  delete(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
    this.updateLocalStorage();
  }

  update(updatedUser: User) {
    const index = this.users.findIndex((user) => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.updateLocalStorage();
    }
  }

  private updateLocalStorage() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }
}
