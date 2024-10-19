export enum Status {
  Incomplete = "Incomplete",
  InProgress = "InProgress",
  Complete = "Complete",
}

export default interface IGoalInterface {
  id: string;
  name: string;
  description: string;
  status: Status;
  deadline: Date;
}
