import { Quiz, QuizBundle } from '../entities/quiz';

export class QuizBundleRepository {
  private quizBundles: QuizBundle[] = JSON.parse(
    localStorage.getItem('quizBundles') || '[]'
  );

  add(bundle: QuizBundle) {
    const newBundle = {
      ...bundle,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.quizBundles.push(newBundle);
    this.updateLocalStorage();
  }

  getAll(): QuizBundle[] {
    return this.quizBundles.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : -Infinity; // Treat null as very old date
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : -Infinity; // Treat null as very old date

      return dateB - dateA; // Newest first
    });
  }

  getById(id: string): QuizBundle | undefined {
    return this.quizBundles.find((bundle) => bundle.id === id);
  }

  getQuizzesByBundleId(bundleId: string): Quiz[] | undefined {
    const bundle = this.getById(bundleId);
    return bundle?.quizzes;
  }

  delete(bundleId: string) {
    this.quizBundles = this.quizBundles.filter(
      (bundle) => bundle.id !== bundleId
    );
    this.updateLocalStorage();
  }

  update(updatedBundle: QuizBundle) {
    const index = this.quizBundles.findIndex(
      (bundle) => bundle.id === updatedBundle.id
    );
    if (index !== -1) {
      this.quizBundles[index] = {
        ...updatedBundle,
        updatedAt: new Date(),
      };
      this.updateLocalStorage();
    }
  }

  private updateLocalStorage() {
    localStorage.setItem('quizBundles', JSON.stringify(this.quizBundles));
  }
}
