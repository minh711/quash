import { QuizBundleRepository } from './quiz-bundle-repository';
import { QuizRepository } from './quiz-repository';
import { UserRepository } from './user-repository';

export class DataSource {
  public quizRepository: QuizRepository;
  public userRepository: UserRepository;
  public quizBundleRepository: QuizBundleRepository;

  private static instance: DataSource;

  private constructor() {
    this.quizRepository = new QuizRepository();
    this.userRepository = new UserRepository();
    this.quizBundleRepository = new QuizBundleRepository();
  }

  public static getInstance(): DataSource {
    if (!DataSource.instance) {
      DataSource.instance = new DataSource();
    }
    return DataSource.instance;
  }
}
