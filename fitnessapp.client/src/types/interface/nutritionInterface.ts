export default interface INutritionInterface {
  id: string;
  name: string;
  calories: number;
  weight?: number;
  amount?: number;
  date: Date;
  notes?: string;
}
