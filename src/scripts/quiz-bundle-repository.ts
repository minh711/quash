import { Quiz, QuizBundle } from '../entities/quiz';

export class QuizBundleRepository {
  private quizBundles: QuizBundle[] = JSON.parse(
    localStorage.getItem('quizBundles') || '[]'
  );

  constructor() {
    this.initializePresetBundle();
  }

  private initializePresetBundle() {
    const presetId1 = 'preset-bundle';
    const presetId2 = 'old-quizzes'; // New preset ID

    // Check if the first preset bundle exists
    if (!this.quizBundles.some((bundle) => bundle.id === presetId1)) {
      const veryPastDate = new Date(0); // January 1, 1970
      const presetBundle1: QuizBundle = {
        id: presetId1,
        name: 'Gói câu hỏi mẫu',
        description:
          'Bạn muốn thử nghiệm hệ thống? Hãy đến với gói câu hỏi có sẵn này.',
        createdAt: veryPastDate,
        updatedAt: veryPastDate,
        isPreset: true,
      };
      this.quizBundles.push(presetBundle1);
    }

    // Check if the second preset bundle exists
    if (!this.quizBundles.some((bundle) => bundle.id === presetId2)) {
      const veryPastDate = new Date(0); // January 1, 1970
      const presetBundle2: QuizBundle = {
        id: presetId2,
        name: 'Gói câu hỏi cũ',
        description:
          'Những câu hỏi từ phiên bản thử nghiệm của bạn sẽ được lưu ở đây.',
        createdAt: veryPastDate,
        updatedAt: veryPastDate,
        isPreset: true,
      };
      this.quizBundles.push(presetBundle2);
    }

    this.updateLocalStorage();
  }

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

  delete(bundleId: string) {
    this.quizBundles = this.quizBundles.filter(
      (bundle) => bundle.id !== bundleId
    );
    this.updateLocalStorage();

    localStorage.removeItem(`${bundleId}-count`);
    localStorage.removeItem(`${bundleId}-count`);
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
