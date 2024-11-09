import QuizRepository from './quiz-repository';
import UserRepository from './user-repository';

class DataSource {
  public quizRepository: QuizRepository;
  public userRepository: UserRepository;

  private static instance: DataSource;

  private constructor() {
    this.quizRepository = new QuizRepository();
    this.userRepository = new UserRepository();
  }

  public static getInstance(): DataSource {
    if (!DataSource.instance) {
      DataSource.instance = new DataSource();
    }
    return DataSource.instance;
  }
}

export default DataSource.getInstance();
