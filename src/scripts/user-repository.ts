import { User } from '../entities/user';

export class UserRepository {
  private users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

  constructor() {
    this.mockupUser();
  }

  private mockupUser() {
    // Create a default user if the list is empty
    if (this.users.length === 0) {
      const defaultUser: User = {
        id: 'user',
        name: '',
        avatar: '/assets/avatars/avatar-0.png',
        quote: '',
        score: 0,
        uploadedQuizCount: 0,
        answeredQuizCount: 0,
        correctAnswerCount: 0,
        incorrectAnswerCount: 0,
        wrathCount: 0,
        topCorrectPerQuizCount: 0,
        topIncorrectPerQuizCount: 0,
        topWrathPerQuizCount: 0,
      };
      this.add(defaultUser); // Add the default user
    }
  }

  add(user: User) {
    // Check if user already exists by id to avoid duplication
    const existingUser = this.users.find(
      (existingUser) => existingUser.id === user.id
    );
    if (!existingUser) {
      this.users.push(user);
      this.updateLocalStorage();
    }
  }

  getAll(): User[] {
    return this.users;
  }

  getById(id: string | null): User | undefined {
    if (id === null) {
      return this.users[0]; // Return the first user if id is null
    }
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
